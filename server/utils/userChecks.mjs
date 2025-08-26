export const checkIfAdmin = async(req,res,next) => {
    if(req.user && req.user.email === "solitdio079@gmail.com"){
      return next()
    }
    return res.send({error: "Vous n'etes pas Admin"})
  }
  export const checkIfConnected = async(req,res,next) => {
    if(req.user){
      return next()
    }
    return res.send({error: "Vous n'etes pas Connecter"})
  }