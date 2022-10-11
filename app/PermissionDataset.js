const permissions = {
    Admin : {
        creation: ['Admin', 'Agent', 'Merchant', 'Personal'],
        transactions: [
            {
                kind : "Agent Cash In",
                with: ["Agent"],
                minus: "Admin",
                plus: "Agent",
                charge: 10, 
                commission: {
                    Admin: 20,
                    Agent: 80
                },
                min: 10000.00,
                max: 1000000.00
            },
            {
                kind : "Admin Cash In",
                with: ["Admin"],
                minus: "Admin",
                plus: "Admin",
                min: 100000.00,
                max: 10000000.00
            }
        ]
    },
    Agent : {
        creation: ['Personal'],
        transactions: [
            {
                kind : "Cash In",
                with: ["Personal"],
                minus: "Agent",
                plus: "Personal",
                min: 100.00,
                max: 25000.00
            },
            {
                kind : "Mobile Recharge",
                with: ["Admin"],
                minus: "Agent",
                plus: "Admin",
                min: 20.00,
                max: 999.00
            }
        ]
    },
    Merchant: {
        creation: ["Mobile Recharge"],
        transactions: [
            {
                kind : "Cash Out",
                with: ["Agent"],
                minus: "Merchant",
                plus: "Agent",
                min: 100.00,
                max: 50000.00
            },
            {
                kind : "Payment",
                with: ["Merchant"],
                minus: "Merchant",
                plus: "Merchant",
                commission: {
                    Admin: 1.2 // Mul amount er upore
                },
                min: 100.00,
                max: 100000.00
            },
            {
                kind : "Mobile Recharge",
                with: ["Admin"],
                minus: "Merchant",
                plus: "Admin",
                min: 20.00,
                max: 999.00
            }
        ]
    },
    Personal: {
        creation: [],
        transactions: [
            {
                kind : "Cash Out",
                with: ["Agent"],
                minus: "Personal",
                plus: "Agent",
                charge: 1.8,
                commission: {
                    Admin: 20,
                    Agent: 80
                },
                min: 100.00,
                max: 25000.00
            },
            {
                kind : "Payment",
                with: ["Merchant"],
                minus: "Personal",
                plus: "Merchant",
                commission: {
                    Admin: 1.2 // Mul amount er upore
                },
                min: 100.00,
                max: 100000.00
            },
            {
                kind : "Mobile Recharge",
                with: ["Admin"],
                minus: "Personal",
                plus: "Admin",
                min: 20.00,
                max: 999.00
            }
        ]
    }
}

module.exports = permissions