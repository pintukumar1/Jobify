const { StatusCodes } = require("http-status-codes")
const { BadRequestError, InternalServerError, UnAuthenticatedError } = require("../errors")
const Job = require("../models/job")

const createJob = async (req, res, next) => {
    const { company, position, jobLocation, jobType, status } = req.body
    const createdBy = req.user.userId

    if (!company || !position) {
        const error = new BadRequestError("PLease provide all values")
        return next(error)
    }

    const job = new Job({
        company, position, createdBy, jobLocation, jobType, status
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

const updateJob = async (req, res, next) => {
    const jobId = req.params.id
    const { company, position } = req.body
    if (!position || !company) {
        const error = new BadRequestError("Please provide all values")
        return next(error)
    }

    let job
    try {
        job = await Job.findById(jobId)
    } catch (err) {
        const error = new InternalServerError("job updation failed, Please try again..")
        return next(error)
    }

    if (!job) {
        const error = new BadRequestError("Job not found with this id.")
        return next(error)
    }

    if (req.user.userId !== job.createdBy.toString()) {
        const error = new UnAuthenticatedError("Not authorized to access this route..")
        return next(error)
    }

    let updatedJob
    try {
        updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body,
            {
                new: true,
                runValidators: true
            })
    } catch (err) {
        const error = new InternalServerError("job updation failed")
        return next(error)
    }
    res.status(StatusCodes.OK).json({ job: updatedJob })
}

const deleteJob = async (req, res, next) => {
    const jobId = req.params.id
    let job
    try {
        job = await Job.findById(jobId)
    } catch (err) {
        const error = new InternalServerError("could not delete this job..")
        return next(error)
    }

    if (!job) {
        const error = new BadRequestError("Job not found")
        return next(error)
    }

    if (req.user.userId !== job.createdBy.toString()) {
        const error = new UnAuthenticatedError("Not authorized to accesss this route.")
        return next(error)
    }

    try {
        await job.remove()
    } catch (err) {
        const error = new InternalServerError("Could not delete this post")
        return next(error)
    }

    res.status(StatusCodes.OK).json({ msg: "job deleted Successfully" })
}


const showStats = async (req, res) => {
    res.send.log("showStats")
}

exports.createJob = createJob
exports.deleteJob = deleteJob
exports.getAllJobs = getAllJobs
exports.updateJob = updateJob
exports.showStats = showStats