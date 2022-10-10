const express = require('express');
const router = express.Router();

router.get('/about', (req, res) => {
    res.send("Hi From Web");
});

// baseurl/about

module.exports = router;