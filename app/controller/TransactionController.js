const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Transaction = require('../model/Transaction');
const Helpers = require('../Helpers');
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

            
            const fromAccount = await User.findOne({phone: from});
            const toAccount = await User.findOne({phone: to});
            // check from exists
            if(!fromAccount){
                return res.status(404).send({
                    success : false,
                    msg: "Kire Beta Chor!",
                    body: req.body
                })
            }
            // check to exists
            if(!toAccount){
                
                if(kind !== "Mobile Recharge"){
                    
                    return res.status(404).send({
                        success : false,
                        msg: `Account does not exist.`,
                        body: req.body
                    })
                }
            }

            // Verify Permission
            const permissions = require('../PermissionDataset');
            const transactionPermission = Helpers.verifyTransactionPermission(req.authData, permissions, kind);
            if(!transactionPermission){
                return res.status(403).send({
                    success : false,
                    msg: "You don't have permission to transact " + kind,
                    body: req.body
                })
            }


            const cookedTransactions = await Helpers.cookTransaction(fromAccount, toAccount, amount, kind, transactionPermission, req.authData);
            if(!cookedTransactions.success){
                return res.status(cookedTransactions.code).send({
                    success : false,
                    msg: cookedTransactions.msg,
                    body: req.body
                })
            }

            // insert data
            for(let i = 0; i < cookedTransactions.transactions.length; i++){
                let currentTransaction = cookedTransactions.transactions[i];
                currentTransaction.reference = reference;
                currentTransaction.createdBy = req.authData._id;
                let newTransaction = await new Transaction(currentTransaction);
                await newTransaction.save();
                // from account balance update
                if(currentTransaction.kind !== "Gopon Cash Out"){
                    await User.findOneAndUpdate(
                        {phone: currentTransaction.from.phone},
                        {$set: {
                            balance: currentTransaction.from.currentBalance
                        }},
                        {new: true}
                    );
                }
                
                // to account balance update
                if(currentTransaction.kind !== "Mobile Recharge"){
                    await User.findOneAndUpdate(
                        {phone: currentTransaction.to.phone},
                        {$set: {
                            balance: currentTransaction.to.currentBalance
                        }},
                        {new: true}
                    );
                }
            }

            return res.status(200).send({
                success : true,
                msg: "Transaction Successful",
                body: {}
            })

        }
        catch(error){
            console.log(error);
            return res.status(500).send({
                success : false,
                msg: error.message,
                tag : 'Internal'
            })
        }
    },

    
    
}

