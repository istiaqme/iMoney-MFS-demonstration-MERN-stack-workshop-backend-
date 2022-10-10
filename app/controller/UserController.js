const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
module.exports = {
    login : async function (req, res) {
        try {
            const {phone, pin, kind} = req.body;
            // find user
            const user = await User.findOne({
                phone: phone,
                kind: kind
            });
            if(!user){
                return res.status(500).send({
                    success : false,
                    msg: 'Account not found.',
                    body: req.body
                })
            }

            const pinVerification = await bcrypt.compare(pin, user.pin);
            if(!pinVerification){
                return res.status(500).send({
                    success : false,
                    msg: 'PIN is wrong.',
                    body: req.body
                })
            }

            // User is verified
            // JWT sign
            const tokenData = {
                name: user.name,
                phone: user.phone,
                kind: user.kind
            }
            
            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: '1hr'});
            return res.status(200).send({
                suceess: true,
                msg: "Login Successful.",
                data: {
                    authToken: token
                }
            });



        }
        catch(error){
            return res.status(500).send({
                success : false,
                msg: error.message,
                tag : 'Internal'
            })
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
                return res.status(500).send({
                    success : false,
                    msg: validation.error.details[0].message,
                    body: req.body
                })
            }

            let {name, phone, pin, address, kind, nid} = req.body;

            const accountTypes = ['Admin', 'Merchant', 'Agent', 'Personal'];
            const permissions = require('../PermissionDataset');
            const thisUsersPermissions = permissions[req.authData.kind];
            if(!thisUsersPermissions.creation.includes(kind)){
                return res.status(403).send({
                    success : false,
                    msg: "You don't have permission to create " + kind,
                    body: req.body
                })
            }


            if(!accountTypes.includes(kind)){
                return res.status(404).send({
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

                return res.status(200).send({
                    suceess: true,
                    msg: "A new user is created.",
                    data: {
                        name: name,
                        phone: phone
                    }
                });
            }
            else{
                return res.status(400).send({
                    success : false,
                    msg: "This User Exists In Our Wallet",
                    body: req.body
                })
            }
            
        }
        catch(error){
            return res.status(500).send({
                success : false,
                msg: error.message,
                tag : 'Internal'
            })
        }
    }
    
}

