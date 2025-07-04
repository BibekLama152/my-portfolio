import jwt from "jsonwebtoken";
import { expressjwt as expressJwt } from "express-jwt";
import User from "../models/user.model.js";
import config from "../../config/config.js";



export const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.status(401).json({ error: "User not found" });

    if (!user.authenticate(req.body.password))
      return res.status(401).json({ error: "Email and password do not match" });

    const token = jwt.sign({ _id: user._id }, config.jwtSecret);
    res.cookie("t", token, { expire: new Date() + 9999 });

    return res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    return res.status(401).json({ error: "Could not sign in" });
  }
};

export const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({ message: "Signed out" });
};

export const requireSignin = expressJwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth"
});

export const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id.toString() === req.auth._id;
  if (!authorized) {
    return res.status(403).json({ error: "User is not authorized" });
  }
  next();

  
};



