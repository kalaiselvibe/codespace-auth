const jwt =require('jsonwebtoken')
const auth =(req,res,next)=>{
      //grab token from cookie
      console.log(req.cookies)
      const {token}= req.cookies
     
         //if no token,stop there
     if(!token){
         res.status(403).send('please login first')
     
     }
     
         //decode that token get id
         try{
const decode =jwt.verify(token,'shhhh')
console.log(decode);
req.user=decode
         }catch(error){
        console.log(error);
        res.status(401).send('invalid token')
         }
         return next()
}
module.exports=auth
