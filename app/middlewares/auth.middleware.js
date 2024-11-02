import Jwt from "jsonwebtoken";
import { responseModel } from "../utils/responseModel.js";

export default function authMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json(responseModel(false, "Unauthorized user"));
    }

    const [bearer, token] = authorization.split(" ");

    const jwtsecret = process.env.JWT_SECRET;

    const decoded = Jwt.verify(token, jwtsecret);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json(responseModel(false, "Token has expired"));
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json(responseModel(false, "Invalid token"));
    } else {
      return res.status(500).json(responseModel(false, "An error occured"));
    }
  }
}
