import {
    RegisterDto, LoginDto, SendOtpDto, VerifyAccountDto, TwoStepVerifyDto, VerifyCodeActive2StepVerify, ResetPasswordDto
} from "../dto";
import userRepository ,{UserRepository} from "./../../user/repository/user.repository";
// import AuthRepository from "./../repository/auth.repository"
import bcrypt from 'bcrypt';
import {User} from "../../user/model/user.model";
import {userAlreadyExist, userAlreadyVerified, userNotExist} from "../../user/error";
import {generatedOtp} from "../../../lib/utils/otp";
import {comparePassword, hashedPassword} from "../utils/hash";
import {cacheProvider} from "../../../lib/cache/init";
import {toMs, toSeconds} from "../../../pkg/utils/time";
import {mailjetProvider, nodemailerProvider} from "../../../lib/email/init";
import {MailProvider} from "../../../pkg/mailjet/mail.interface";
import {NodeMailerProvider} from "../../../pkg/mailjet/nodemailer";
import {invalidCode, invalidPassword, otpExpired, verificationEnabled, verifyAccountFirst} from "../error";
import {generateaccessToken, generaterefreshToken} from "../utils/token";
import {verifyGoogleToken} from "../../../lib/utils/google.auth";
import {AppError} from "../../../lib/error/error";
import {Provider} from "../enum";
import jwt from "jsonwebtoken";
import {env} from "../../../lib/config/env";
import {TUserPayload} from "../../../lib/interface/userPayload.interface";
import {smsProvider} from "../../../lib/sms/init";

export class AuthService{
    private twoStepVerificationKey:any= '2-step-verification';
    private sendOtpKey = 'otp';
    private readonly userRepository:UserRepository = userRepository;
    private readonly mailProvider:MailProvider;
        constructor() {
            this.mailProvider=mailjetProvider;
            // this.mailProvider=nodemailerProvider;
              }
     register = async(registerDto:RegisterDto)=> {
        // 1-check userByEmail Exist
        const User = await this.userRepository.findByEmail(registerDto.email);
        // 1.1 if-> exist throw an Error
        if (User) throw userAlreadyExist;

        // 2-prepare Date (hash-password)
         registerDto.password = await hashedPassword(registerDto.password);

        // 3-save User into DB
        const createdUser = await this.userRepository.create(registerDto);

        // 4-generate & send email verification
        const otp = generatedOtp();

// console.log(`${userDate.email}: ${otp}`);

        //Fixed: Added await here so the OTP saves before the email sends
        // await otpRepository.createOtp({
        //     code: otp,
        //     email: userDate.email,
        //     expiredAt: new Date(Date.now() + toMs(5, 'minutes'))
        // });
        await cacheProvider.set(`${this.sendOtpKey}${createdUser._id.toString()}`, otp, toSeconds(3,'minutes'));

        await this.mailProvider.send(registerDto.email, 'verification code', `
        <div style=" font-family: Arial, Helvetica, sans-serif; background-color: #f4f7fb; padding: 40px 20px; ">
         <div style=" max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 12px; padding: 35px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); ">
          <h1 style=" color: #2563eb; text-align: center; margin-bottom: 10px; ">
           Verify Your Email is
            </h1> 
            <p style=" color: #555; font-size: 16px; text-align: center; line-height: 1.6; ">
             Welcome! Thank you for creating an account with us. Please use the verification code below to verify your email address. 
             </p>
              <div style=" background-color: #f0f6ff; border: 2px dashed #2563eb; border-radius: 10px; padding: 20px; margin: 30px 0; text-align: center; ">
               <p style=" margin: 0 0 8px; color: #666; font-size: 14px; ">
                Your Verification Code 
                </p> <div style=" font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; ">
                 ${otp} 
                 </div>
                  </div>
                   <p style=" color: #777; font-size: 14px; text-align: center; line-height: 1.5; ">
                    This code will expire in <strong>5 minutes</strong>. Please do not share this code with anyone. 
                    </p> <hr style=" border: none; border-top: 1px solid #eee; margin: 30px 0; ">
                     <p style=" color: #999; font-size: 12px; text-align: center; margin: 0; ">
                     If you did not create this account, you can safely ignore this email. </p>
                      </div> </div> `);
        // //5-save otp into DB
        return createdUser;

    }

    verifyAcount = async(verifyAcountDto:VerifyAccountDto)=> {
        //1-check user exist
        const user = await this.userRepository.findByEmail(verifyAcountDto.email);
        //1.1- not exist -> throw error "user is not exist"
        if (!user) throw userNotExist;
        //1.2- isVerifed == true -> throw error "user is verified"
        if (user.isVerified === true) throw userAlreadyVerified;
        //2- check otp validation
        // const otp = await otpRepository.getOtpByEmail(email)
        const otp = await cacheProvider.get(`${this.sendOtpKey}${user._id.toString()}`)
        //2.1-not exist into DB -> throw error "otp expired"
        if (!otp) throw otpExpired;
        //2.2- code not equel code -> throw error "invalid code"
        if (otp !== verifyAcountDto.code) throw invalidCode;
        //3-switch is verifed = true
        const updatedUSer = await this.userRepository.update({email:verifyAcountDto.email}, { isVerified: true });
        //4-delete otp from DB
        // await otpRepository.deleteOtpByEmail(email)
        await cacheProvider.del(`${this.sendOtpKey}${user._id.toString()}`)
        return updatedUSer;
    }

    login =async(loginDto:LoginDto)=> {
        const User = await this.userRepository.findByEmail(loginDto.email);

        if (!User) throw userNotExist;

        if (User.isVerified !== true) throw verifyAccountFirst;

        const matching = await comparePassword(loginDto.password, User.password);

        if (!matching) throw invalidPassword;

        const accessToken = generateaccessToken({id:User._id,name:User.userName});
        const refreshToken = generaterefreshToken({id:User._id,name:User.userName});
        if (User.twoStepVerification === true) throw verificationEnabled;

        const ttlRemaining = await  cacheProvider.ttl(`${loginDto.email}:login`);
        const attempts = ttlRemaining ?? 5;
        const ttl = ttlRemaining === -2 ? toSeconds(3,"minutes"):ttlRemaining;
        await cacheProvider.set(`${loginDto.email}:login`,String(+attempts - 1),ttl);
        return{accessToken,refreshToken};

        // const otp = generatedOtp();
        // await cacheProvider.set(`${this.sendOtpKey}${User._id.toString()}`, otp, toSeconds(1,'minutes'));
        // await this.mailProvider.send(loginDto.email, 'verification code', `
        // <div style=" font-family: Arial, Helvetica, sans-serif; background-color: #f4f7fb; padding: 40px 20px; ">
        //  <div style=" max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 12px; padding: 35px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); ">
        //   <h1 style=" color: #2563eb; text-align: center; margin-bottom: 10px; ">
        //    Verify Your Email is
        //     </h1>
        //     <p style=" color: #555; font-size: 16px; text-align: center; line-height: 1.6; ">
        //      Welcome! Thank you for creating an account with us. Please use the verification code below to verify your email address.
        //      </p>
        //       <div style=" background-color: #f0f6ff; border: 2px dashed #2563eb; border-radius: 10px; padding: 20px; margin: 30px 0; text-align: center; ">
        //        <p style=" margin: 0 0 8px; color: #666; font-size: 14px; ">
        //         Your Verification Code
        //         </p> <div style=" font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; ">
        //          ${otp}
        //          </div>
        //           </div>
        //            <p style=" color: #777; font-size: 14px; text-align: center; line-height: 1.5; ">
        //             This code will expire in <strong>5 minutes</strong>. Please do not share this code with anyone.
        //             </p> <hr style=" border: none; border-top: 1px solid #eee; margin: 30px 0; ">
        //              <p style=" color: #999; font-size: 12px; text-align: center; margin: 0; ">
        //              If you did not create this account, you can safely ignore this email. </p>
        //               </div> </div> `);
        // return User;
    }

    sendOtp=async(sendOtpDto : SendOtpDto)=> {
        //1-check user existence
        const User = await this.userRepository.findByEmail(sendOtpDto.email)
        // const User = await this.userRepository.findByEmail(sendOtp.email)
        //1.1-if NO -> throw error "user not exist"
        if(!User) throw userNotExist;
        //2-delete any otp
        await cacheProvider.del(`otp:${User._id.toString()}`);
        //3-generate otp
        const otp = generatedOtp();
        console.log(`${User.email}: ${otp}`);

        //  await otpRepository.createOtp({
        //     code:otp,
        //     email:email,
        //     expiredAt:Date.now()+toMs(3,'minutes')
        //  })
        await cacheProvider.set(`otp:${User._id.toString()}`, otp, toMs(3,'minutes'));
        // 5- Send OTP via SMS
        // await smsProvider.sendSms(sendOtpDto.email, `Your verification code is ${otp}. It expires in 3 minutes.`);
        //
        // return {
        //     message: "OTP sent successfully"
        // };
        //4-send otp email
        await mailjetProvider.send(sendOtpDto.email, 'New verification code', `
    <div style="
        font-family: Arial, Helvetica, sans-serif;
        background-color: #f4f7fb;
        padding: 40px 20px;
    ">
        <div style="
            max-width: 500px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 12px;
            padding: 35px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        ">
            <h1 style="
                color: #2563eb;
                text-align: center;
                margin-bottom: 10px;
            ">
                New Verification Code
            </h1>

            <p style="
                color: #555;
                font-size: 16px;
                text-align: center;
                line-height: 1.6;
            ">
                You requested a new verification code.
                Please use the code below to verify your email address.
            </p>

            <div style="
                background-color: #f0f6ff;
                border: 2px dashed #2563eb;
                border-radius: 10px;
                padding: 20px;
                margin: 30px 0;
                text-align: center;
            ">
                <p style="
                    margin: 0 0 8px;
                    color: #666;
                    font-size: 14px;
                ">
                    Your New Verification Code
                </p>

                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    color: #2563eb;
                ">
                    ${otp}
                </div>
            </div>

            <p style="
                color: #777;
                font-size: 14px;
                text-align: center;
                line-height: 1.5;
            ">
                This code will expire in <strong>3 minutes</strong>.
                Please do not share this code with anyone.
            </p>

            <hr style="
                border: none;
                border-top: 1px solid #eee;
                margin: 30px 0;
            ">

            <p style="
                color: #999;
                font-size: 12px;
                text-align: center;
                margin: 0;
            ">
                If you did not request a new verification code,
                you can safely ignore this email.
            </p>
        </div>
    </div>
    `);

    }

    resetPassword=async(resetPasswordDto:ResetPasswordDto)=> {
        // 1. Find user by email
        const User = await this.userRepository.findByEmail(resetPasswordDto.email);

        if (!User) throw userNotExist;

        // 1 - Await the OTP from otpRepository
        // const otp = await otpRepository.getOtpByEmail(email);
        const otp = await cacheProvider.get(`otp:${User._id.toString()}`);
        if (!otp) throw otpExpired;

        // 2 - Compare codes safely
        if (String(otp) !== String(resetPasswordDto.code)) throw invalidCode;

        // 3 - Hash new password and update user using userRepository
        const hashedpassword = await hashedPassword(resetPasswordDto.newPassowrd);
        await userRepository.update({email:resetPasswordDto.email},{ password: hashedpassword });

        // 4 - Delete OTP using otpRepository
        // await otpRepository.deleteOtpByEmail(email);
        await cacheProvider.del(`otp:${User._id.toString()}`);
    }

    loginWithGoogle=async(idToken:string)=> {
        // 1. Verify Google's ID token
        const payload = await verifyGoogleToken(idToken);
        if(!payload) throw new AppError("no payload Provider",400)
        // 2. Find user by email
        let user = await this.userRepository.findByEmail(payload.email as string);

       // if user exist
        if (user) {
              return generateaccessToken({
                  id:user._id,
                  email:user.email,
              })
        }
        // 3. Create user if they don't exist
        const createUser = await this.userRepository.create({

            userName:payload.name,
            email:payload.email,
            provider:Provider.GOOGLE,
            isVerified:true,
        });

        // 4. Generate access and refresh tokens
        return generateaccessToken({
            id:createUser._id,
            email:createUser.email,
        })
    }

    refreshTokenFn = async (token:string)=>{
            const payload = jwt.verify(token,env.jwt.refreshScret) as TUserPayload;
            const accessToken = generateaccessToken({sub:payload.sub,userName:payload.userName})
            const refreshToken = generaterefreshToken({sub:payload.sub,userName:payload.userName});
            return{accessToken,refreshToken}
    }

  enable2StepVerification = async(twoStepVerifyDto : TwoStepVerifyDto) => {

    // 1. Check user existence
    const user = await this.userRepository.findByEmail(twoStepVerifyDto.email);
    if (!user) throw userNotExist;
   // 2. Check if already enabled
   // if (user.twoStepVerification === true) throw verificationEnabled;
   // 3. Generate OTP code
   const code = generatedOtp();
   // 4. Store OTP in cache
    await cacheProvider.set(`${this.twoStepVerificationKey}${user._id.toString()}`, code, toSeconds(3, 'minutes')
    );
     // 5. Send OTP to email
  await mailjetProvider.send(twoStepVerifyDto.email, "Two Step Verification",`Your verification code is ${code}`);
}

    verifyCodeActive2StepVerified = async (
        verifyCodeActive2StepVerify: VerifyCodeActive2StepVerify
    ) => {

        // 1. Check user existence
        const user = await this.userRepository.findByEmail(
            verifyCodeActive2StepVerify.email
        );

        if (!user) throw userNotExist;

        // 2. Check if Two-Step Verification is already enabled
        if (user.twoStepVerification === true) {
            throw verificationEnabled;
        }

        // 3. Get OTP from Redis
        const key = `${this.twoStepVerificationKey}${user._id.toString()}`;

        const cacheCode = await cacheProvider.get(key);

        // 4. Check OTP expiration / existence
        if (!cacheCode) throw otpExpired;

        // 5. Check OTP validity
        if (String(cacheCode) !== String(verifyCodeActive2StepVerify.code)) {
            throw invalidCode;
        }

        // 6. Delete OTP after successful verification
        await cacheProvider.del(key);

        // 7. Activate Two-Step Verification
        const updatedUser = await this.userRepository.update(
            user._id,
            { twoStepVerification: true }
        );

        return updatedUser;
    };


}
export default new AuthService();