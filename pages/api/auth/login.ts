import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { Collection } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const userCollection: Collection = client
      .db(process.env.DB_NAME)
      .collection("user");

      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body);
      }

    const { userName, password } = req.body;

    if (!userName) {
      return res
        .status(401)
        .send({ message: "username or password is incorrect" });
    }

    if (req.method === "POST") {
      const user = await userCollection.findOne({
        userName,
      });

      if (!user) {
        return res
          .status(401)
          .send({ message: "username or password is incorrect" });
      }

      var passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res
          .status(401)
          .send({ message: "username or password is incorrect" });
      }

      let jwtSecretKey = process.env.JWT_SECRET_KEY || '';

      let data = {
        time: Date(),
        userId: user.userId,
        isAdmin: user.role === 'admin'
      };

      const token = jwt.sign(data, jwtSecretKey);

      return res.json({ token, isAdmin: data.isAdmin, message: "Login Success" });
    } else {
      return res.status(400).send({
        message: "Error in while login",
      });
    }
  } catch (err: any) {
    return res.status(500).send({
      message: err.message,
    });
  } finally {
    res.end();
  }
}
