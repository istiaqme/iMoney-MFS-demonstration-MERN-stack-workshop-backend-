const mongoose = require('mongoose');

// fields definition
const fields = {
    from : {
        type : String
    },
    to: {
        type: String
    },
    amount: {
        type: Number
    },
    reference: {
        type: String
    },
    kind: {
        type: String // "Agent Cash In", "Cash Out", "Cash In", "Payment", "Mobile Recharge"
    },
    status: {
        type: String // 'Success', 'On Hold'
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