const jwt = require('jsonwebtoken');
const JWT_Secret = 'thisiswebtokensecret';


const fetchuser = (req, res, next)=>{
    //Get the user form the JWT token and add id to req obj
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Please Authenticate using a valid token"});
    }
    try {
        const data = jwt.verify(token, JWT_Secret);
        console.log(data)
        req.User = data.user;

        next();
    } catch (error) {
        res.status(401).send({error:"Internal Please Authenticate using a valid token"});
    }
}


module.exports = fetchuser;