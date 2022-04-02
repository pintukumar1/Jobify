const createJob = async (req, res) => {
    res.send.log("Create job")
}

const getAllJobs = async (req, res) => {
    res.send.log("get all jobs")
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