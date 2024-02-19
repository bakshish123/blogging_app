const { verifyToken } = require("../service/authentication");

function checkForAuthenticationCookie(cookieName){
    return(req,res,next)=>{
        const cookieTokenValue= req.cookies[cookieName];
        if(!cookieTokenValue){
         return next();
        }
        try{
            const userPayload = verifyToken(cookieTokenValue);
            req.user= userPayload;
        }
        catch(error){}
        return next();
    }
}

module.exports = {checkForAuthenticationCookie};