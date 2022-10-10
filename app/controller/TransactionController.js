const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Transaction = require('../model/Transaction');
module.exports = {
    transact : async function (req, res) {
        try {
            // req.body
            let {from, to, amount, reference, kind} = req.body;
            const joiSchema = Joi.object({
                from: Joi.string().pattern(new RegExp(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/)).required().messages({
                    'string.pattern.base' : 'Please Provide a Bangladeshi Phone Number.'
                }),
                to: Joi.string().pattern(new RegExp(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/)).required().messages({
                    'string.pattern.base' : 'Please Provide a Bangladeshi Phone Number.'
                }),
                amount: Joi.number().required(),
                kind: Joi.string().required(),
                reference: Joi.string(),
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

            // Verify Permission
            const permissions = require('../PermissionDataset');
            const thisUsersPermissions = permissions[req.authData.kind];
            if(!thisUsersPermissions.transactions.includes(kind)){
                return res.status(403).send({
                    success : false,
                    msg: "You don't have permission to create " + kind,
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
    },

    
    
}

