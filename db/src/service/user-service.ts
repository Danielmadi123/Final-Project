import { IUser } from "../@types/user";
import { User } from "../database/model/user";
import { BizCardsError } from "../error/biz-cards-error";
import { auth } from "./auth-service";

type IJWTPayload = {
  email: string;
  id: string;
  isAdmin?: boolean;
  isBusiness?: boolean;
  isVerified?: boolean;
};

const createUser = async (userData: IUser) => {
  const user = new User(userData);
  user.password = await auth.hashPassword(user.password);
  return user.save();
};

const validateUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new BizCardsError("Bad credentials", 401);
  }

  const isPasswordValid = await auth.validatePassword(password, user.password);

  if (!isPasswordValid) {
    throw new BizCardsError("Bad credentials", 401);
  }

  const jwtPayload: IJWTPayload = {
    email,
    id: user._id,
    isBusiness: user.isBusiness,
    isAdmin: user.isAdmin,
  };

  const isVerified = user.isVerified ?? false;

  if (!isVerified) {
    throw new BizCardsError("User is not verified", 401);
  }

  const jwt = auth.generateJWT(jwtPayload);

  return { jwt, isVerified };
};

export { createUser, validateUser };
