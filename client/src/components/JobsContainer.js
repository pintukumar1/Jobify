import React, { useEffect } from 'react'
import Loading from './Loading'
import Wrapper from '../assets/wrappers/JobsContainer'
import { useAppContext } from '../context/appContext'
import Job from './Job'

const SearchContainer = () => {
    const { jobs, getAllJobs, isLoading, page, totalJobs, search, searchStatus, searchType, sort } = useAppContext()

    useEffect(() => {
        getAllJobs()
    }, [search, searchStatus, searchType, sort])


    if (isLoading) {
        return <Loading center />
    }

    if (jobs.length === 0) {
        return (
            <Wrapper>
                <h2>No jobs to display...</h2>
            </Wrapper>
        )
    }
    return (
        <Wrapper>
            <h5>
                {totalJobs} job{jobs.length > 1 && 's'} found
            </h5>
            <div className="jobs">
                {jobs.map((job) => {
                    return <Job key={job._id} {...job} />
                })}
            </div>
            {/* pagination buttons */}
        </Wrapper>

    )
}

export default SearchContainer