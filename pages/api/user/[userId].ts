import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { Collection } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const userCollection: Collection = client
      .db(process.env.DB_NAME)
      .collection("user");

    const userId = req.query.userId as String;

    if (!userId) {
      return res.status(400).send("invalid userid");
    }

    if (req.method === "POST") {
      const user = await userCollection.findOne({
        userId,
      });

      if (!user) {
        return res.status(400).send("invalid userid");
      }

      await userCollection.updateOne(
        {
          userId,
        },
        {
            ...req.body,
            role: 'user'
        }
      );

      return res.json({ userId, message: "User Updated Successfully" });
    } else  {
      return res.status(400).send({
        message: "Error in updating data",
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
