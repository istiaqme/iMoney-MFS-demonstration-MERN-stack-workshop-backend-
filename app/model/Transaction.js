const mongoose = require('mongoose');

// fields definition
const fields = {
    from : {
        type : Object
    },
    to: {
        type: Object
    },
    amount: {
        type: Number
    },
    reference: {
        type: String
    },
    kind: {
        type: String 
    },
    status: {
        type: String // 'Success', 'On Hold'
    },
    trxid: {
        type: String 
    },
    createdBy: {
        type: String
    }
    
}


// wrap fields with mongoose schema

const schema = mongoose.Schema(fields, {timestamps: true})


// wrap schema with mongoose model

const model = mongoose.model('Transaction', schema);

module.exports = model;
