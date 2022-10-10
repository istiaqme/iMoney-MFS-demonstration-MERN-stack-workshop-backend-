const permissions = {
    Admin : {
        creation: ['Admin', 'Agent', 'Merchant', 'Personal'],
        transactions: ["Agent Cash In", "Cash Out", "Cash In", "Payment", "Mobile Recharge"]
    },
    Agent : {
        creation: ['Personal'],
        transactions: ["Agent Cash In", "Cash In", "Mobile Recharge"]
    },
    Merchant: {
        creation: ["Mobile Recharge"],
        transactions: [ "Cash Out", "Payment", "Mobile Recharge"]
    },
    Personal: {
        creation: [],
        transactions: [ "Cash Out", "Payment", "Mobile Recharge"]
    }
}

module.exports = permissions