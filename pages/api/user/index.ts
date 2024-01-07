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
    const userCollection: Collection = client
      .db(process.env.DB_NAME)
      .collection("user");

    // User Create Method
    if (req.method === "POST") {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body);
      }
      console.error("---->>>> ", req.body);
      const createResult: any = await userCollection.insertOne({
        ...req.body,
        role: "user",
        userId: v4(),
        createdAt: new Date(),
      });

      return res.json({
        userId: createResult?.userId,
        message: "User Updated Successfully",
      });
    }
    if (req.method === "GET") {
      /**
       * Get All non-admin user lists
       */
      const usersList: any = await userCollection.find(
        {
          role: {
            $ne: "admin",
          },
        },
        {
          projection: {
            password: 0,
          },
        }
      );

      return res.json({
        data: await usersList.toArray(),
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
