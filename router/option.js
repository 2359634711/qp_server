const express = require('express')
const router = express.Router()

const { getOptions, updateOptions } = require('../api/optionApi')


router.get('/getOptions', (req, res) => {
    getOptions(req, res)
})
router.post('/updateOptions', (req, res) => {
    updateOptions(req, res)
})



module.exports = router