import Posts from "../models/posts.mjs";
import { upload, destination } from "../utils/multerUpload.mjs";
import express, { Router } from "express";
import postValidator from "../validators/postValidator.mjs";
import { validationResult, checkSchema, matchedData } from "express-validator";
import passport from "passport";
import { checkIfAdmin, checkIfConnected } from "../utils/userChecks.mjs";
import fs from "node:fs";

const router = Router();

const validationFn = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.send({ error: result.array()[0].msg });
  }
  return matchedData(req);
};
const checkPost = async (id, res) => {
  const oldPost = await Posts.findById(id);
  if (!oldPost) return res.send({ error: "Post not found" });
  return oldPost;
};

// create a post
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkIfAdmin,
  upload.single("cover"),
  checkSchema(postValidator),
  async (req, res) => {
    const { title, content, category } = validationFn(req, res);
    const cover = req.file.filename;
    const author = {
      avatar: req.user.avatar,
      name: req.user.fullName,
      id: req.user._id,
      role: req.user.role,
    };
    try {
      const newPost = new Posts({ title, content, category, cover, author });
      await newPost.save();
      // Maybe send notification later
      return res.send({ msg: "Post created!", newPost });
    } catch (error) {
      return res.send({ error: error.msg });
    }
  }
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  checkIfAdmin,
  upload.single("cover"),
  checkSchema(postValidator),
  async (req, res) => {
    const { id } = req.params;
    const oldPost = await checkPost(id, res);
    // validate the fields in the request
    const { title, content,category } = validationFn(req, res);
    const cover = req.file.filename;

    // put new fields in oldPost
    oldPost.title = title;
    oldPost.content = content;
    oldPost.category = category;
    // delete old cover
    try {
      fs.unlinkSync(destination + oldPost.cover);
    } catch (error) {}
    oldPost.cover = cover;

    try {
      await Posts.findByIdAndUpdate(id, oldPost);
      // Maybe send notification later
      return res.send({ msg: "Post updated!", oldPost });
    } catch (error) {
      return res.send({ error: error.msg });
    }
  }
);
router.use(express.json());
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  checkIfAdmin,
  checkSchema(postValidator),
  async (req, res) => {
    const { id } = req.params;
    const oldPost = await checkPost(id, res);
    // Validate fields
    const { title, content,category } = validationFn(req, res);
    // put new fields in oldPost
    oldPost.title = title;
    oldPost.content = content;
    oldPost.category = category;
    try {
      await Posts.findByIdAndUpdate(id, oldPost);
      // Maybe send notification later
      return res.send({ msg: "Post updated!", oldPost });
    } catch (error) {
      return res.send({ error: error.msg });
    }
  }
);
router.get("/", async(req,res) => {
  const {cursor,limit,category} = req.query
  const query = {} 
  if(cursor){
    query._id = {$lt:cursor}
  }
  if(category){
    query.category = category
  }
  try {
    const allPosts = await Posts.find(query,null,{limit:Number(limit)|| 0,sort: {_id:-1}})
    return res.send(allPosts)
    
  } catch (error) {
    return res.send({error: error.message})
  }

})
router.get("/:id",async(req,res) => {
  const {id} = req.params 

  try {
    const singlePost = await Posts.findById(id)
    if(!singlePost) return res.send({error: "Post not found!"})
      return res.send(singlePost)
  } catch (error) {
    return res.send({error: error.message})
  }

})

router.delete("/:id", passport.authenticate("jwt",{session:false}), checkIfAdmin, async(req,res) => {
  const { id } = req.params;
  const oldPost = await checkPost(id, res);
  try {
    // delete cover
    try {
      fs.unlinkSync(destination + oldPost.cover)
    } catch (error) {
      
    }
    await Posts.findByIdAndDelete(id)
    return res.send({ msg: "Post deleted!", oldPost });
    
  } catch (error) {
    return res.send({error: error.message})
  }

})
export default router;
