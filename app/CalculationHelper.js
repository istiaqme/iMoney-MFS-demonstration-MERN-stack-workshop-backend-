function calculateFromPercentage(percentage, baseAmount){
    return (percentage*baseAmount) /100;
}
function makeTrxID(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
   }
   return "Trx"+result;
}




module.exports = {
    calculateFromPercentage,
    makeTrxID
}