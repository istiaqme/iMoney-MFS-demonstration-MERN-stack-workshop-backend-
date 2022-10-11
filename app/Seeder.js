const User = require('../app/model/User');
const bcrypt = require('bcrypt');
async function seedUser(){
    let pin = "123456";
    const salt = await bcrypt.genSalt(10);
    pin = await bcrypt.hash(pin, salt);
    const dataToSeed = {
        'name' : 'Istiaq Hasan',
        'phone' : '01711000000',
        'pin' : pin,
        'address' : 'Dacca, Bengal Province, East India, Great Britain',
        'nid' : '847747887494',
        'kind' : 'Admin',
        'balance' : 100000000
    }

    const user = await User.findOne({phone: dataToSeed.phone});

    if(!user){
        const newUser = new User(dataToSeed);
        
        await newUser.save();
        await User.findOneAndUpdate(
            {phone: dataToSeed.phone},
            {$set: {
                createdBy: newUser._id
            }},
            {new: true}
        );
    }
}

module.exports = {seedUser};