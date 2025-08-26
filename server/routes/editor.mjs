import express, {Router} from 'express' 
import { upload, destination } from "../utils/multerUpload.mjs";
import passport from 'passport';
import { checkIfAdmin } from '../utils/userChecks.mjs';
import fetch from "node-fetch"
import fs from "node:fs"

const router = Router() 
router.post("/uploadFile", upload.single("image"), async(req,res)=> {

    try {
      const image = req.file.filename 
      return res.send({
        "success" : 1,
        "file": {
            "url" : "http://localhost:3000/"+image,
            // ... and any additional fields you want to store, such as width, height, color, extension, etc
        }
    })
        
    } catch (error) {
        return res.send({
            "success" : 0,
            "error": error.message
        })
        
    }
    
})
router.use(express.json())
router.post("/uploadUrl", upload.single("image"),async(req,res) =>{
    const {url} = req.body
    const filename = url.split("/")[url.split("/").length-1]
    const fileExtentsion = filename.split(".")[1]

    const finalName = crypto.getRandomValues() + "."+fileExtentsion
    const finalDestination = destination + finalName
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer, 'binary');
        fs.writeFile(finalDestination, buffer, () => 
          console.log('finished downloading!'));
        return res.send({
            "success" : 1,
            "file": {
                "url" : "http://localhost:3000/"+finalName,
                // ... and any additional fields you want to store, such as width, height, color, extension, etc
            }
        })
        
    } catch (error) {
        return res.send({
            "success" : 0,
            "error": error.message
        })
    }
})



export default router