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
        console.log(from);
        console.log(to);
        console.log(amount);
        console.log(transactionKind);
        console.log(transactionSettings);
        console.log(thisUser);
    }
}