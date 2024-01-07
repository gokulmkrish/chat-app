import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { Collection } from "mongodb";
import { v4 } from 'uuid';
var bcrypt = require("bcryptjs");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const userCollection: Collection = client
      .db(process.env.DB_NAME)
      .collection("user");

    // User Create Method
    if (req.method === "POST") {
      const createResult: any = await userCollection.insertOne({
        ...req.body,
        role: "admin",
        userId: v4(),
        password: bcrypt.hashSync(req.body.password, 8),
        createdAt: new Date()
      });

      return res.json({
        userId: createResult?.userId,
        message: "User Signup Successful",
      });
    } else {
      return res.status(400).send({
        message: "Error in signup",
      });
    }
  } catch (err: any) {
    return res.status(500).send({
      message: err?.message,
    });
  } finally {
    res.end();
  }
}
