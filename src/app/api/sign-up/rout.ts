import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/app/model/user";
import bcrypt from "bcryptjs";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    const existingUserWithUsername = await UserModel.findOne({
      username,
      isVerifyed: true,
    });
    if (existingUserWithUsername) {
      return Response.json(
        {
          message: "Username is already taken",
          success: false,
        },
        { status: 400 }
      );
    }
    const existingUserWithEmail = await UserModel.findOne({ email });

    // verification code
    const verifyCode = Math.floor(10000 + Math.random() * 90000).toString();

    if (existingUserWithEmail) {
      if (existingUserWithEmail.isVerifyed) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          { status: 400 }
        );
      } else {
        existingUserWithEmail.password = await bcrypt.hash(password, 10);
        existingUserWithEmail.verifyCode = verifyCode;
        existingUserWithEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserWithEmail.save();
      }
    } else {
      const hashedPass = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPass,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerifyed: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User register successfuly please Verify by email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error while signing up the user", error);
    return Response.json(
      { success: false, message: "Error while signing up the user" },
      { status: 500 }
    );
  }
}
