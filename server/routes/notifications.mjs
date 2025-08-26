import express, { Router } from "express";
import Notifications from "../models/notifications.mjs";
import { matchedData, checkSchema, validationResult } from "express-validator";
import admin from "../utils/firebaseAdmin.mjs";
import notificationValidator from "../validators/notificationValidator.mjs";
import Users from "../models/users.mjs";
import { checkIfAdmin } from "../utils/userChecks.mjs";
import passport from "passport";

const router = Router();

router.use(express.json());

// create Notification
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkSchema(notificationValidator),
  async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.send({ error: result.array()[0].msg });
    }

    // get validated fields
    const { fromId, toId, content } = matchedData(req);

    // Check that the sender is not the receiver
    if (fromId === toId)
      return res.send({ error: "Choisisez un autre receveur!" });

    // check for the from and the to users
    const fromUser = await Users.findById(fromId);
    if (!fromUser) return res.send({ error: "Envoyeur invalid!" });
    const toUser = await Users.findById(toId);
    if (!toUser) return res.send({ error: "Recveur invalid!" });

    // assemble the new Notification
    const title = `Message venant de ${
      fromUser.role === "Admin" ? fromUser.role : fromUser.fullName
    }`;
    const to = toId;
    const from = { id: fromUser._id, avatar: fromUser.avatar };
    const newNotif = new Notifications({ title, to, from, content });
    await newNotif.save();

    // send with FCM
    // send message with Admin SDK
    const message = {
      token: toUser.fcmToken,
      notification: {
        title: title,
        body: "aeemt.info",
      },
      data: {
        notifString: JSON.stringify(newNotif),
      },
      webpush: {
        fcm_options: {
          link: "http://localhost:5173/admin/",
        },
      },
    };
    admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
        //return res.send(response)
      })
      .catch((error) => {
        console.log("Error sending message:", error);
        return res.send({ error: error.message });
      });

    // Send Admin the response
    return res.send({ msg: "Message envoye!" });
  }
);

router.post(
  "/bulk",
  passport.authenticate("jwt", { session: false }),
  checkIfAdmin,
  async (req, res) => {
    try {
      let allUsers = await Users.find();
      // Remove the sender from the list 
      allUsers = allUsers.filter(user => user._id !== req.user._id)
      const { content } = req.body;
      const title = `Message de ${req.user.role}`;
      const from = { id: req.user._id, avatar: req.user.avatar };

      // send to notification to everyone
      allUsers.forEach(async (user) => {
        // construct new Notification
        const newNotif = new Notifications({
          to: user._id,
          from,
          title,
          content,
        });
        await newNotif.save();

        // send with FCM
        // send message with Admin SDK
        const message = {
          token: user.fcmToken,
          notification: {
            title: title,
            body: "aeemt.info",
          },
          data: {
            notifString: JSON.stringify(newNotif),
          },
          webpush: {
            fcm_options: {
              link: "http://localhost:5173/admin/",
            },
          },
        };
        admin
          .messaging()
          .send(message)
          .then((response) => {
            // Response is a message ID string.
            console.log("Successfully sent message:", response);
            //return res.send(response)
          })
          .catch((error) => {
            console.log("Error sending message:", error);
          });
      });

      // Send Admin the response
      return res.send({ msg: "Messages envoye!" });
    } catch (error) {
      return res.send({ error });
    }
  }
);

router.get("/:to", async (req, res) => {
  const { to } = req.params;

  try {
    const allNotifications = await Notifications.find({ to });
    return res.send(allNotifications);
  } catch (error) {
    return res.send({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const oldNotif = await Notifications.findById(id);
  if (!oldNotif) return res.send({ error: "Notifications not found" });

  try {
    await Notifications.findByIdAndDelete(id);
    return res.send({ msg: "Notification deleted!", deleted: oldNotif });
  } catch (error) {
    return res.send({ error: error.message });
  }
});

export default router;
