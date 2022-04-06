const { StatusCodes } = require("http-status-codes")
const { BadRequestError, InternalServerError } = require("../errors")
const { find } = require("../models/job")
const Job = require("../models/job")

const createJob = async (req, res, next) => {
    const { company, position } = req.body
    const createdBy = req.user.userId

    if (!company || !position) {
        const error = new BadRequestError("PLease provide all values")
        return next(error)
    }

    const job = new Job({
        company, position, createdBy
    })

    try {
        await job.save()
    } catch (err) {
        const error = new InternalServerError("Job creation failed, PLease try again.")
        return next(error)
    }
    res.status(StatusCodes.CREATED).json({ job: job })
}

const getAllJobs = async (req, res, next) => {
    let jobs
    try {
        jobs = await Job.find({ createdBy: req.user.userId })
    } catch (err) {
        const error = new InternalServerError("Unable to fetch jobs, please try again.")
        return next(error)
    }
    res.status(StatusCodes.OK).json({ job: jobs, totalJobs: jobs.length, numOfPages: 1 })
}

const updateJob = async (req, res) => {
    res.send.log("Update job")
}

const deleteJob = async (req, res) => {
    res.send.log("Delete job")
}


const showStats = async (req, res) => {
    res.send.log("showStats")
}

exports.createJob = createJob
exports.deleteJob = deleteJob
exports.getAllJobs = getAllJobs
exports.updateJob = updateJob
exports.showStats = showStats