import { ExtractJwt, Strategy } from 'passport-jwt'
import passport from 'passport'
import Users from '../models/users.mjs'
import dotenv from 'dotenv'
dotenv.config()

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await Users.findById(payload.id)
      if (user){ return done(null, user)}
      else if(payload.email){
        const emailUser = await Users.findOne({email: payload.email }) 
        if (emailUser){ return done(null, emailUser)}
      }
     
    } catch (error) {
      return done(error)
    }
  })
)
