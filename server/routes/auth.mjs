import jwt from "jsonwebtoken"
import express, {Router} from "express"
import "../strategies/passport-jwt.mjs"
import Users from "../models/users.mjs"
import passport from "passport"
import {} from 'dotenv/config'
const router = Router()

router.use(express.json())
router.get('/', (req, res) => {
  console.log('The main auth page!')
})


router.post('/signin',
    async(req, res) => {
      const {email} = req.body

      let user  = await Users.findOne({email})
      if(!user){
       return {error: "Vous n'avez pas de compte!"}

      }
      const accessToken = jwt.sign({id:user._id},process.env.JWT_SECRET)

      return res.send({ token: accessToken, user })
    }
)

router.get('/jwt/status', passport.authenticate('jwt',{session:false}),(req, res) => {
    req.user ? res.send(req.user) : res.send({ error: 'You are not logged in!' })
})

export default router