"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_repository_1 = __importDefault(require("./../../user/repository/user.repository"));
const error_1 = require("../../user/error");
const otp_1 = require("../../../lib/utils/otp");
const hash_1 = require("../utils/hash");
const init_1 = require("../../../lib/cache/init");
const time_1 = require("../../../pkg/utils/time");
const init_2 = require("../../../lib/email/init");
const error_2 = require("../error");
const token_1 = require("../utils/token");
const google_auth_1 = require("../../../lib/utils/google.auth");
const error_3 = require("../../../lib/error/error");
const enum_1 = require("../enum");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../../lib/config/env");
class AuthService {
    twoStepVerificationKey = '2-step-verification';
    sendOtpKey = 'otp';
    userRepository = user_repository_1.default;
    mailProvider;
    constructor() {
        this.mailProvider = init_2.mailjetProvider;
        // this.mailProvider=nodemailerProvider;
    }
    register = async (registerDto) => {
        // 1-check userByEmail Exist
        const User = await this.userRepository.findByEmail(registerDto.email);
        // 1.1 if-> exist throw an Error
        if (User)
            throw error_1.userAlreadyExist;
        // 2-prepare Date (hash-password)
        registerDto.password = await (0, hash_1.hashedPassword)(registerDto.password);
        // 3-save User into DB
        const createdUser = await this.userRepository.create(registerDto);
        // 4-generate & send email verification
        const otp = (0, otp_1.generatedOtp)();
        // console.log(`${userDate.email}: ${otp}`);
        //Fixed: Added await here so the OTP saves before the email sends
        // await otpRepository.createOtp({
        //     code: otp,
        //     email: userDate.email,
        //     expiredAt: new Date(Date.now() + toMs(5, 'minutes'))
        // });
        await init_1.cacheProvider.set(`${this.sendOtpKey}${createdUser._id.toString()}`, otp, (0, time_1.toSeconds)(3, 'minutes'));
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
    };
    verifyAcount = async (verifyAcountDto) => {
        //1-check user exist
        const user = await this.userRepository.findByEmail(verifyAcountDto.email);
        //1.1- not exist -> throw error "user is not exist"
        if (!user)
            throw error_1.userNotExist;
        //1.2- isVerifed == true -> throw error "user is verified"
        if (user.isVerified === true)
            throw error_1.userAlreadyVerified;
        //2- check otp validation
        // const otp = await otpRepository.getOtpByEmail(email)
        const otp = await init_1.cacheProvider.get(`${this.sendOtpKey}${user._id.toString()}`);
        //2.1-not exist into DB -> throw error "otp expired"
        if (!otp)
            throw error_2.otpExpired;
        //2.2- code not equel code -> throw error "invalid code"
        if (otp !== verifyAcountDto.code)
            throw error_2.invalidCode;
        //3-switch is verifed = true
        const updatedUSer = await this.userRepository.update({ email: verifyAcountDto.email }, { isVerified: true });
        //4-delete otp from DB
        // await otpRepository.deleteOtpByEmail(email)
        await init_1.cacheProvider.del(`${this.sendOtpKey}${user._id.toString()}`);
        return updatedUSer;
    };
    login = async (loginDto) => {
        const User = await this.userRepository.findByEmail(loginDto.email);
        if (!User)
            throw error_1.userNotExist;
        if (User.isVerified !== true)
            throw error_2.verifyAccountFirst;
        const matching = await (0, hash_1.comparePassword)(loginDto.password, User.password);
        if (!matching)
            throw error_2.invalidPassword;
        const accessToken = (0, token_1.generateaccessToken)({ id: User._id, name: User.userName });
        const refreshToken = (0, token_1.generaterefreshToken)({ id: User._id, name: User.userName });
        // if (User.twoStepVerification === true) throw verificationEnabled;
        const ttlRemaining = await init_1.cacheProvider.ttl(`${loginDto.email}:login`);
        const attempts = ttlRemaining ?? 5;
        const ttl = ttlRemaining === -2 ? (0, time_1.toSeconds)(3, "minutes") : ttlRemaining;
        await init_1.cacheProvider.set(`${loginDto.email}:login`, String(+attempts - 1), ttl);
        return { accessToken, refreshToken };
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
    };
    sendOtp = async (sendOtpDto) => {
        //1-check user existence
        const User = await this.userRepository.findByEmail(sendOtpDto.email);
        // const User = await this.userRepository.findByEmail(sendOtp.email)
        //1.1-if NO -> throw error "user not exist"
        if (!User)
            throw error_1.userNotExist;
        //2-delete any otp
        await init_1.cacheProvider.del(`otp:${User._id.toString()}`);
        //3-generate otp
        const otp = (0, otp_1.generatedOtp)();
        console.log(`${User.email}: ${otp}`);
        //  await otpRepository.createOtp({
        //     code:otp,
        //     email:email,
        //     expiredAt:Date.now()+toMs(3,'minutes')
        //  })
        await init_1.cacheProvider.set(`otp:${User._id.toString()}`, otp, (0, time_1.toMs)(3, 'minutes'));
        // 5- Send OTP via SMS
        // await smsProvider.sendSms(sendOtpDto.email, `Your verification code is ${otp}. It expires in 3 minutes.`);
        //
        // return {
        //     message: "OTP sent successfully"
        // };
        //4-send otp email
        await init_2.mailjetProvider.send(sendOtpDto.email, 'New verification code', `
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
    };
    resetPassword = async (resetPasswordDto) => {
        // 1. Find user by email
        const User = await this.userRepository.findByEmail(resetPasswordDto.email);
        if (!User)
            throw error_1.userNotExist;
        // 1 - Await the OTP from otpRepository
        // const otp = await otpRepository.getOtpByEmail(email);
        const otp = await init_1.cacheProvider.get(`otp:${User._id.toString()}`);
        if (!otp)
            throw error_2.otpExpired;
        // 2 - Compare codes safely
        if (String(otp) !== String(resetPasswordDto.code))
            throw error_2.invalidCode;
        // 3 - Hash new password and update user using userRepository
        const hashedpassword = await (0, hash_1.hashedPassword)(resetPasswordDto.newPassowrd);
        await user_repository_1.default.update({ email: resetPasswordDto.email }, { password: hashedpassword });
        // 4 - Delete OTP using otpRepository
        // await otpRepository.deleteOtpByEmail(email);
        await init_1.cacheProvider.del(`otp:${User._id.toString()}`);
    };
    loginWithGoogle = async (idToken) => {
        // 1. Verify Google's ID token
        const payload = await (0, google_auth_1.verifyGoogleToken)(idToken);
        if (!payload)
            throw new error_3.AppError("no payload Provider", 400);
        // 2. Find user by email
        let user = await this.userRepository.findByEmail(payload.email);
        // if user exist
        if (user) {
            return (0, token_1.generateaccessToken)({
                id: user._id,
                email: user.email,
            });
        }
        // 3. Create user if they don't exist
        const createUser = await this.userRepository.create({
            userName: payload.name,
            email: payload.email,
            provider: enum_1.Provider.GOOGLE,
            isVerified: true,
        });
        // 4. Generate access and refresh tokens
        return (0, token_1.generateaccessToken)({
            id: createUser._id,
            email: createUser.email,
        });
    };
    refreshTokenFn = async (token) => {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwt.refreshScret);
        const accessToken = (0, token_1.generateaccessToken)({ sub: payload.sub, userName: payload.userName });
        const refreshToken = (0, token_1.generaterefreshToken)({ sub: payload.sub, userName: payload.userName });
        return { accessToken, refreshToken };
    };
    enable2StepVerification = async (twoStepVerifyDto) => {
        // 1. Check user existence
        const user = await this.userRepository.findByEmail(twoStepVerifyDto.email);
        if (!user)
            throw error_1.userNotExist;
        // 2. Check if already enabled
        // if (user.twoStepVerification === true) throw verificationEnabled;
        // 3. Generate OTP code
        const code = (0, otp_1.generatedOtp)();
        // 4. Store OTP in cache
        await init_1.cacheProvider.set(`${this.twoStepVerificationKey}${user._id.toString()}`, code, (0, time_1.toSeconds)(3, 'minutes'));
        // 5. Send OTP to email
        await init_2.mailjetProvider.send(twoStepVerifyDto.email, "Two Step Verification", `Your verification code is ${code}`);
    };
}
exports.AuthService = AuthService;
exports.default = new AuthService();
