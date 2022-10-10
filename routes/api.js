const express = require('express');
const router = express.Router();
const UserController = require('../app/controller/UserController');

router.get('/', (req, res) => {
    res.send("Hi From API");
});

router.post('/login', UserController.login);


module.exports = router;