import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/mongodb";
import { Collection } from "mongodb";

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
      return res.status(400).send("invalid groupId");
    }

    console.log('>>>>>>>> group id', groupId, req.query)

    if (req.method === "PUT") {
      /**
       * Update group information endpoint
       */
      const group = await groupCollection.findOne({
        groupId,
      });

      if (!group) {
        return res.status(400).send("invalid groupId");
      }

      await groupCollection.updateOne(
        {
          groupId,
        },
        {
          ...req.body,
        }
      );

      return res.json({ groupId, message: "Group updated successful" });
    } else if (req.method === "GET") {
      /**
       * Get particular group endpoint
       */
      const group = await groupCollection.findOne({
        groupId,
      });

      console.log('>>>>>>>> group data', group)

      if (!group) {
        return res.status(400).json({
          message: "Group not found",
        });
      }

      return res.json({
        data: group,
        message: "Group get Successfull",
      });
    } else if (req.method === "DELETE") {
      /**
       * Get particular group endpoint
       */
      const group = await groupCollection.findOne({
        groupId,
      });

      if (!group) {
        return res.status(400).json({
          message: "Group not found",
        });
      }

      await groupCollection.deleteOne({
        groupId,
      });

      return res.json({
        data: group,
        message: "Group deleted successfully",
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
