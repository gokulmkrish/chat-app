import { v4 } from "uuid";
import { Collection, Document } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

import clientPromise from "../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const groupCollection: Collection = client
      .db(process.env.DB_NAME)
      .collection("group");

    if (req.method === "POST") {
      /**
       * Create group endpoint
       */
      const createResult: Document = await groupCollection.insertOne({
        ...req.body,
        createdAt: new Date(),
        createdBy: req?.body?.userId,
        groupId: v4(),
        groupName: req.body.groupName,
        members: [{
          userId: req?.body?.userId,
          addedOn: new Date(),
          isAdmin: true
        }]
      });

      return res.json({
        groupId: createResult.groupId,
        message: "Group Created Successfully",
      });
    } else if (req.method === "GET") {
      /**
       * Get Users list endpoint
       */
      const group = await groupCollection.find();

      if (!group) {
        return res.status(400).json({
          message: "Group not found",
        });
      }

      return res.json({
        data: group,
        message: "Groups get Successfull",
      });
    } else {
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
