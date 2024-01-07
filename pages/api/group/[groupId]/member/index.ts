import { v4 } from "uuid";
import { Collection, Document } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

import clientPromise from "../../../../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const groupCollection: Collection = client
      .db(process.env.DB_NAME)
      .collection("group");

    const groupId: String = req?.query?.groupId as String;

    if (!groupId) {
      return res.status(400).send("invalid userid");
    }

    /**
     * Add Member to existing group
     */
    if (typeof req.body === "string") {
      req.body = JSON.parse(req.body);
    }

    console.log("memebrs----", req.body);

    if (!req?.body?.members || !req?.body?.members?.length) {
      return res.status(400).json({
        message: "Invalid Data",
      });
    }

    if (req.method === "PATCH") {
      const members = req.body.members.map((id: string) => ({
        userId: id,
        addedOn: new Date(),
        isAdmin: false,
      }));

      const result: Document = await groupCollection.updateOne(
        {
          groupId,
        },
        {
          $push: {
            members: {
              $each: members || [],
            },
          },
        }
      );

      return res.json({
        groupId: result.groupId,
        message: "Memeber Added to the group Successfully",
      });
    } else if (req.method === "DELETE") {
      /**
       * Get Users list endpoint
       */
      const members = req.body.members || [];

      console.log("memebts ------->>>", members);

      const result: Document = await groupCollection.updateOne(
        {
          groupId,
        },
        {
          $pull: {
            members: {
              userId: {
                $in: members || [],
              },
            },
          },
        }
      );

      return res.json({
        data: groupId,
        message: "Members Removed from the Group successfully",
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
