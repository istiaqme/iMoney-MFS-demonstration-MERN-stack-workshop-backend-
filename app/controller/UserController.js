const User = require('../model/User');
module.exports = {
    login : async function (req, res) {
        try {
            
        }
        catch(error){
            
        }
    },

    TempRegister : async function (req, res){
        try{
            const {name, phone, pin, address, kind, nid} = req.body;
            let newUser = new User({
                name: name,
                phone: phone,
                pin : pin,
                address: address,
                kind: kind,
                nid: nid
            });

            await newUser.save();
            res.send(newUser);
        }
        catch(error){

        }
    }
    
}

