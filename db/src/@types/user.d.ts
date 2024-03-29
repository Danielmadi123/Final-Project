import { ObjectId } from "mongoose";

type IName = {
  first: string;
  middle?: string;
  last: string;
};

type IAddress = {
  street: string;
  city: string;
  state?: string;
  zip?: string;
  country: string;
  houseNumber: number;
};

type IImage = {
  alt: string;
  url: string;
};

type IUser = {
  name: IName;
  address: IAddress;
  image?: IImage;
  email: string;
  phone: string;
  password: string;
  isBusiness: boolean;
  isAdmin?: boolean;
  createdAt?: Date;
  verificationCode?: string;
  verificationTimeout?: NodeJS.Timeout;
  emailReminderTimeout?: NodeJS.Timeout | null;
  isVerified?: boolean;
  newCodeRequested: boolean;
  verificationTimeoutExpired: boolean;
  _id?: string;
  id?: string;
  token?: string;
  resetPasswordToken?: string; // Add resetPasswordToken field
  resetPasswordExpire?: Date; // Add resetPasswordExpire field
};

type ExtendedUser = IUser & {
  user?: User;
  isAdmin?: boolean;
};

type ILogin = {
  email: string;
  password: string;
};

type IJWTPayload = {
  email: string;
  isAdmin?: boolean;
  isBusiness?: boolean;
  isVerified?: boolean;
};

export { IUser, IName, IAddress, IImage, ILogin, IJWTPayload, ExtendedUser };
