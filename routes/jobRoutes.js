import express from "express"
import jobController from "../controllers/jobController.js"

const router = express.Router()

router.get("/", jobController.getAllJobs)

router.post("/", jobController.createJob)

router.get("/stats", jobController.showStats)

router.patch("/:id", jobController.updateJob)

router.delete("/:id", jobController.deleteJob)

export default router