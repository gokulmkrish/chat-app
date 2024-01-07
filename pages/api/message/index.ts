import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { Collection } from "mongodb";
import { v4 } from 'uuid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const messageCollection: Collection = client
      .db(process.env.DB_NAME)
      .collection("message");

    // User Create Method
    if (req.method === "POST") {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body);
      }
      const createResult: any = await messageCollection.insertOne({
        ...req.body,
        role: "user",
        userId: v4(),
        createdAt: new Date(),
      });

      return res.json({
        userId: createResult?.userId,
        message: "User Updated Successfully",
      });
    } else {
      return res.status(400).send({
        message: "Error in creating data",
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
