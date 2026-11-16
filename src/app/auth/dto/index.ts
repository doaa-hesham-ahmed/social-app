import {Gender} from "../enum";

// contracts
export interface RegisterDto {
    userName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    gender?: Gender;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface SendOtpDto {
    email: string;
}

export interface VerifyAccountDto {
    email: string;
    code: string;
}
export interface ResetPasswordDto {
    email: string;
    code: string;
    newPassowrd:string;
}

export interface LoginWithGoogleDto {
    email: string;
    code: string;
}

export interface TwoStepVerifyDto {
    email: string;
    password: string;
}

export interface VerifyCodeActive2StepVerify {
    email: string;
    code: string;
}