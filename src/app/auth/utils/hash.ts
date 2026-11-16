import argon2 from "argon2";
import bcrypt from 'bcrypt';
export async function hashedPassword(password:string){
    // return bcrypt.hash(password,10)
    return argon2.hash(password)
};

export async function comparePassword(password:string,hashedPassword:string) {
    // return bcrypt.compare(password,hashedPassword)
    return argon2.verify(hashedPassword,password);
}