import express, { Router } from "express";
import User from "../models/users.mjs";
import { upload, destination } from "../utils/multerUpload.mjs";
import { userValidator } from "../validators/userValidator.mjs";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { checkIfAdmin, checkIfConnected } from "../utils/userChecks.mjs";
import passport from "passport";
import fs from "node:fs"
const router = Router();

// CRUD For users Resource

// create user with image

router.post(
  "/",
  upload.single("avatar"),
  checkSchema(userValidator),
  async (req, res) => {
    // the validation with express validator
    const result = validationResult(req);
    if (!result.isEmpty()) return res.send({ error: result.array()[0].msg });

    // get the verified fileds
    const { fullName, email } = matchedData(req);
    // get the avatar
    const avatar = req.file.filename;

    try {
      const newUser = new User({ fullName, email, avatar });
      await newUser.save();
      return res.send({ msg: "user created", newUser });
    } catch (error) {
      return res.send({ error: error.message });
    }
  }
);

router.put(
  "/:id",
  upload.single("avatar"),
  checkSchema(userValidator),
  passport.authenticate("jwt", { session: false }),
  checkIfConnected,
  async (req, res) => {
    const { id } = req.params;
    const oldUser = await User.findById(id);
    if (!oldUser) return res.send({ error: "User not found!" });
    // the validation with express validator
    const result = validationResult(req);
    if (!result.isEmpty()) return res.send({ error: result.array()[0].msg });

    // get the verified fileds
    const { name, email } = matchedData(req);
    // delete last avatar
    try {
      fs.unlinkSync(destination + oldUser.avatar);
    } catch (error) {}
    // get the avatar
    const avatar = req.file.filename;


    try {
      oldUser.name = name;
      oldUser.email = email;
      oldUser.avatar = avatar;
      await User.findByIdAndUpdate(id, oldUser);
      return res.send({ msg: "user updated", oldUser });
    } catch (error) {
      return res.send({ error: error.message });
    }
  }
);
router.patch(
  "/avatar",
  passport.authenticate("jwt", { session: false }),
  upload.single("avatar"),
  async (req, res) => {
    const oldUser = req.user;
    if (!oldUser) return res.send({ error: "User not found!" });
    //
    const avatar = req.file.filename;
    // delete last avatar
    try {
      fs.unlinkSync(destination + oldUser.avatar);
    } catch (error) {}
    // set new avatar link
    oldUser.avatar = avatar;
    try {
      await User.findByIdAndUpdate(oldUser._id, oldUser);
      return res.send(oldUser);
    } catch (error) {
      return res.send({ error: error.message });
    }
  }
);
router.use(express.json());
router.post("/verifyEmail", async (req, res) => {
  const { email } = req.body;
  try {
    const verifiedUser = await User.findOne({ email });
    if (!verifiedUser) return res.send({ error: "No user with this email!" });
    return res.send({ msg: "User verified" });
  } catch (error) {
    return res.send({ error: error.message });
  }
});
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkIfAdmin,
  async (req, res) => {
    try {
      const allUsers = await User.find();
      return res.send(allUsers);
    } catch (error) {
      return res.send({ error: error.message });
    }
  }
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  checkIfConnected,
  checkSchema(userValidator),
  async (req, res) => {
    const { id } = req.params;
    const oldUser = await User.findById(id);
    if (!oldUser) return res.send({ error: "User not found!" });
    // the validation with express validator
    const result = validationResult(req);
    if (!result.isEmpty()) return res.send({ error: result.array()[0].msg });

    // get the verified fileds
    const { fullName, email } = matchedData(req);
    // get the avatar
    if(req.body.fcmToken){
        oldUser.fcmToken = req.body.fcmToken
    }

    try {
      oldUser.fullName = fullName;
      oldUser.email = email;
      await User.findByIdAndUpdate(id, oldUser);
      return res.send(oldUser);
    } catch (error) {
      return res.send({ error: error.message });
    }
  }
);

router.delete("/:id", passport.authenticate("jwt", {session:false}), checkIfConnected, async(req,res) => {
    const { id } = req.params;
    const oldUser = await User.findById(id);
    if (!oldUser) return res.send({ error: "User not found!" });

    try {
        fs.unlinkSync(destination + oldUser.avatar)
    } catch (error) {
        
    }

    try {
        await User.findByIdAndDelete(id)
        return res.send({msg: "User deleted", oldUser})
    } catch (error) {
        return res.send({error: error.message})
    }

})

export default router;
