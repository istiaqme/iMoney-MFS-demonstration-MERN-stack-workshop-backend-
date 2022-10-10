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
        'kind' : 'Admin'
    }

    const user = await User.findOne({phone: dataToSeed.phone});

    if(!user){
        const newUser = new User(dataToSeed);
        await newUser.save();
    }
}

module.exports = {seedUser};