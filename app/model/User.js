const mongoose = require('mongoose');

// fields definition
const fields = {
    name : {
        type : String
    },
    phone: {
        type: String
        
    },
    pin: {
        type: String
    },
    nid: {
        type: String
    },
    address: {
        type: String
    },
    kind: {
        type: String
    },
    createdBy: {
        type: String
    }
    
}


// wrap fields with mongoose schema

const schema = mongoose.Schema(fields, {timestamps: true})


// wrap schema with mongoose model

const model = mongoose.model('User', schema);

module.exports = model;