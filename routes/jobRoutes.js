const express = require('express')
const router = express.Router()

const jobController = require('../controllers/jobController')

router.get("/", jobController.getAllJobs)

router.post("/", jobController.createJob)

router.get("/stats", jobController.showStats)

router.patch("/:id", jobController.updateJob)

router.delete("/:id", jobController.deleteJob)

module.exports = router