const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../model/User');
module.exports = {
    login : async function (req, res) {
        try {
            
        }
        catch(error){
            
        }
    },

    register : async function (req, res){
        try{
            // req.body
            const joiSchema = Joi.object({
                name: Joi.string().min(2).max(250).required(),
                phone: Joi.string().pattern(new RegExp(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/)).required().messages({
                    'string.pattern.base' : 'Please Provide a Bangladeshi Phone Number.'
                }),
                pin: Joi.string().min(6).max(6).required(),
                nid: Joi.string().required(),
                address: Joi.string().required(),
                kind: Joi.string().required()
            });
            const validation = joiSchema.validate(req.body);
            if(validation.error){
                res.status(500).send({
                    success : false,
                    msg: validation.error.details[0].message,
                    body: req.body
                })
            }

            let {name, phone, pin, address, kind, nid} = req.body;

            const accountTypes = ['Merchant', 'Agent', 'Personal'];
            if(!accountTypes.includes(kind)){
                res.status(404).send({
                    success : false,
                    msg: "Kind is Not Supported",
                    body: req.body
                })
            }

            const user = await User.findOne({phone: phone});
            const salt = await bcrypt.genSalt(10);
            pin = await bcrypt.hash(pin, salt);

            if(!user){
                let newUser = new User({
                    name: name,
                    phone: phone,
                    pin : pin,
                    address: address,
                    kind: kind,
                    nid: nid
                });
                await newUser.save();

                res.status(200).send({
                    suceess: true,
                    msg: "A new user is created.",
                    data: {
                        name: name,
                        phone: phone
                    }
                });
            }
            else{
                res.status(400).send({
                    success : false,
                    msg: "This User Exists In Our Wallet",
                    body: req.body
                })
            }
            
        }
        catch(error){
            res.status(500).send({
                success : false,
                msg: error.message,
                tag : 'Internal'
            })
        }
    }
    
}

