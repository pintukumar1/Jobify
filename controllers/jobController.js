import { StatusCodes } from "http-status-codes"
import mongoose from "mongoose"
import Job from "../models/job.js"
import BadRequestError from "../errors/bad-request.js"
import InternalServerError from "../errors/internal-server-error.js"
import UnAuthenticatedError from "../errors/un-authenticated.js"
import moment from "moment"

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
    const { status, jobType, sort, search } = req.query

    const queryObject = {
        createdBy: req.user.userId
    }

    if (status && status !== "all") {
        queryObject.status = status
    }
    if (jobType && jobType !== "all") {
        queryObject.jobType = jobType
    }
    if (search) {
        queryObject.position = { $regex: search, $options: "i" }
    }
    let result = Job.find(queryObject)

    if (sort === "latest") {
        result = result.sort("-createdAt")
    }
    if (sort === "oldest") {
        result = result.sort("createdAt")
    }
    if (sort === "a-z") {
        result = result.sort("position")
    }
    if (sort === "z-a") {
        result = result.sort("-position")
    }

    let jobs
    try {
        jobs = await result
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
    let stats
    stats = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ])

    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr
        acc[title] = count
        return acc
    }, {})

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0
    }

    let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                count: { $sum: 1 }
            },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 },
    ])

    monthlyApplications = monthlyApplications.map((item) => {
        const {
            _id: { year, month }, count
        } = item
        const date = moment()
            .month(month - 1)
            .year(year)
            .format("MMM Y")
        return { date, count }
    })
        .reverse()

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

export default { createJob, deleteJob, getAllJobs, updateJob, showStats }