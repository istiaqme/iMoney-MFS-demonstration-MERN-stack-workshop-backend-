const permissions = {
    Admin : {
        creation: ['Admin', 'Agent', 'Merchant', 'Personal']
    },
    Agent : {
        creation: ['Personal']
    },
    Merchant: {
        creation: []
    },
    Personal: {
        creation: []
    }
}

module.exports = permissions