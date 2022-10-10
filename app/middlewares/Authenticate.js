const jwt = require('jsonwebtoken');
async function authenticate(req, res, next){
    try{
        const authHeader = req.headers['authorization'];
        // Bearer ....
        // ['Bearer', 'dry3ufhtjy']
        const token = authHeader.split(' ')[1];
        //const verification = await jwt.verify(token, process.env.TOKEN_SECRET);
        jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
            if(error){
                return res.status(401).send({
                    success: false,
                    msg: 'Invalid Token',
                    data: {}
                })
            }

            req.authData = user;

            next();
        });
    }
    catch(error){
        return res.status(500).send({
            success : false,
            msg: error.message,
            tag : 'Internal'
        })
    }
    

}

module.exports = authenticate;