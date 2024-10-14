import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerifyed:boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema : Schema<User> = new Schema({
  username:{
    type:String,
    required: [true,"Username is required"],
    trim:true,
    unique:true,
  },
  email:{
    type:String,
    required: [true,"Email is required"],
    trim:true,
    unique:true,
  },
  password:{
    type:String,
    required: [true,"Password is required"],
    trim:true,
  },
  verifyCode:{
    type:String,
    required: [true,"verify code is required"],
  },
  verifyCodeExpiry:{
    type:Date,
    required: [true,"verify code expiry is required"],
  },
  isVerifyed:{
    type:Boolean,
    default:false
  },
  isAcceptingMessage:{
    type:Boolean,
    default:true
  },
  messages:[MessageSchema]
})

export const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)