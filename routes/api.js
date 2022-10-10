const express = require('express');
const router = express.Router();
const UserController = require('../app/controller/UserController');
const TransactionController = require('../app/controller/TransactionController');
const Authenticate = require('../app/middlewares/Authenticate');



router.get('/', (req, res) => {
    res.send("Hi From API");
});

router.post('/login', UserController.login);
router.post('/register', Authenticate, UserController.register);
router.post('/transaction', Authenticate, TransactionController.transact);

// baseurl/api/login


module.exports = router;