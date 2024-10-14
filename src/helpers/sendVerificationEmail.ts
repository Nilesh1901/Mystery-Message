import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emailTemplates/VerificationEmail";


export async function sendVerificationEmail(username:string,email:string,otp:string):Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: "Mystery Message | Verification Code",
      react: VerificationEmail({username,otp}),
    });
    return {success:true,message:"Successfully send the verification email"}
    
  } catch (emailError) {
    console.log("Error sending verification email", emailError)
    return {success:false,message:"Error sending verification email"}
  }
}