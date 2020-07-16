const express = require('express')
const config = require('config')
const router = express.Router()

router.get('/', async function (req, res, next) {
    return res.json({})
})

module.exports = router
