const CalculationHelper = require('./CalculationHelper');
module.exports = {
    verifyTransactionPermission: function (currentUser, permissionDataset, transactionKind){
        const thisUserTransactions = permissionDataset[currentUser.kind].transactions;
        const permission = thisUserTransactions.filter(object => object.kind === transactionKind);
        if(permission.length === 1){
            return permission[0];
        }
        return false;
    },
    cookTransaction: async function(from, to, amount, transactionKind, transactionSettings, thisUser){
        /* console.log(from);
        console.log(to);
        console.log(amount);
        console.log(transactionKind);
        console.log(transactionSettings);
        console.log(thisUser); */

        const transactions = [];

        // Validate with
        if(transactionSettings.with[0] !== to.kind){
            if(transactionKind !== "Mobile Recharge"){
                return {
                    success: false,
                    msg: `${transactionKind} is not possible with this account reason is - to account kind is ${to.kind}.`
                }
            }
        }
        // validate amount min max
        if(amount < transactionSettings.min && amount > transactionSettings.max){
            return {
                success: false,
                msg: `Amount is not valid.`
            }
        }
        // check charge
        let charge = 0;
        if(transactionSettings.hasOwnProperty('charge')){
            charge = CalculationHelper.calculateFromPercentage(transactionSettings.charge, amount);
        }


        // check commission
        let agentCommission = 0;
        let adminCommission = 0;
        if(transactionSettings.hasOwnProperty('commission')){
            // check if agent commission
            if(transactionSettings.commission.hasOwnProperty('Agent')){
                // charge er upor commission
                agentCommission = CalculationHelper.calculateFromPercentage(transactionSettings.commission.Agent, charge);
            }
            if(transactionSettings.commission.hasOwnProperty('Admin')){
                if(transactionKind === "Payment"){
                    // base amount er upor commission
                    adminCommission = CalculationHelper.calculateFromPercentage(transactionSettings.commission.Admin, amount);
                }
                else{
                    // charge er upor commission
                    adminCommission = CalculationHelper.calculateFromPercentage(transactionSettings.commission.Admin, charge);
                }
            }
        }


        const finalAmount = amount + charge;
        if(finalAmount > from.balance){
            return {
                success: false,
                msg: `Balance Low.`
            }
        }

        let balanceAfterTransaction = from.balance - finalAmount; // from er theke jeta minus hobe
        const MAIN_TRANSACTION = {};
        // from er kaj
        const MAIN_TRANSACTION_FROM = {
            phone: from.phone,
            currentBalance: balanceAfterTransaction
        }
        if(transactionSettings.hasOwnProperty('charge')){
            MAIN_TRANSACTION_FROM.charge = {
                percentage: transactionSettings.charge,
                amount: charge
            }
        }
        MAIN_TRANSACTION.from = MAIN_TRANSACTION_FROM;

        

        // to er kaj
        const MAIN_TRANSACTION_TO = {
            phone: to.phone
        }

        if(transactionKind === "Cash Out"){
            MAIN_TRANSACTION_TO.currentBalance = to.balance + amount + agentCommission;
            MAIN_TRANSACTION_TO.commission = {
                percentage: transactionSettings.commission.Agent,
                amount: agentCommission
            };
        } // To Do - Gopon Transaction Ache
        else{
            MAIN_TRANSACTION_TO.currentBalance = to.balance + amount;
        } // To Do - Gopon Transaction - jodio payment hoise merchant er number, kintu commission pabe Admin Merchant er kach theke


        MAIN_TRANSACTION.to = MAIN_TRANSACTION_TO;
        MAIN_TRANSACTION.amount = amount;
        MAIN_TRANSACTION.kind = transactionKind;
        MAIN_TRANSACTION.status = 'Success';

        transactions.push(MAIN_TRANSACTION);

        return {
            success: true,
            transactions: transactions
        }

        



        
    }
}