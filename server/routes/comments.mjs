import express, {Router} from "express"
import Comments from "../models/comments.mjs"
import commentValidator from '../validators/commentValidator.mjs'
import passport from "passport"
import {validationResult, checkSchema, matchedData} from "express-validator"
import {checkIfAdmin, checkIfConnected} from "../utils/userChecks.mjs"


const validationFn = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.send({ error: result.array()[0].msg });
  }
  return matchedData(req);
};
const checkComment = async (id, res) => {
  const oldComment = await Comments.findById(id);
  if (!oldComment) return res.send({ error: "Comment not found" });
  return oldComment;
};


const router = Router()

router.use(express.json())

router.post("/", passport.authenticate("jwt", {session: false}), checkIfConnected,checkSchema(commentValidator), async(req,res)=> {
    const {content, postId} = validationFn(req,res)
    const author = {
        avatar: req.user.avatar,
        name: req.user.fullName,
        id: req.user._id,
    }
    let parent
    if(req.body.parent){
        parent = req.body.parent
    }
    try {
        const newComment = new Comments({author,content,postId,parent})
        await newComment.save()
        // send notification to admin
        return res.send({msg: "Comment created", newComment})
    } catch (error) {
        return res.send({error: error.message})
    }


})

router.get("/:postId", async(req,res) => {
    const {postId} = req.params
    try {
        const CommentComments = await Comments.find({postId}, null, {sort:{_id:-1}})
        return res.send(CommentComments)
    } catch (error) {
        return res.send({error: error.message})
    }
})

router.put("/:id", passport.authenticate("jwt", {session: false}), checkIfConnected, checkSchema(commentValidator),async(req,res)=>{
    const {id} = req.params
    const {content, postId} = validationFn(req,res)
    const oldComment = await checkComment(id,res)
    if(req.body.parent){
        oldComment.parent = req.body.parent
    }
    oldComment.content = content
    oldComment.postId = postId
    try {
       
        await Comments.findByIdAndUpdate(id, oldComment)
        return res.send({msg: "Comment updated", oldComment})
    } catch (error) {
        return res.send({error: error.message})
    }

})

router.delete("/:id" , passport.authenticate("jwt", {session: false}), checkIfConnected, checkSchema(commentValidator),async(req,res)=>{
    const {id} = req.params
   
    const oldComment = await checkComment(id,res)
  
    try {
        await Comments.findByIdAndDelete(id)
        return res.send({msg: "Comment", oldComment})
    } catch (error) {
        return res.send({error: error.message})
    }

})


export default router