import React from 'react'
import { FormRow, Alert, FormRowSelect } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const AddJob = () => {
    const {
        isEditing,
        showAlert,
        displayAlert,
        position,
        company,
        jobLocation,
        jobType,
        jobTypeOptions,
        status,
        statusOptions,
        handleChange,
        clearValues
    } = useAppContext()

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!company || !position || !jobLocation) {
            displayAlert()
            return
        }
        console.log("Create job")
    }

    const handleJobInput = (event) => {
        const name = event.target.name
        const value = event.target.value
        console.log(`${name} ${value}`)
        handleChange({ name, value })
    }

    return (
        <Wrapper>
            <form className="form" onSubmit={handleSubmit}>
                <h3>{isEditing ? "edit job" : "add job"}</h3>
                {showAlert && <Alert />}
                <div className="form-center">
                    <FormRow
                        type="text"
                        name="position"
                        value={position}
                        handleChange={handleJobInput}
                    />
                    <FormRow
                        type="text"
                        name="company"
                        value={company}
                        handleChange={handleJobInput}
                    />
                    <FormRow
                        type="text"
                        name="jobLocation"
                        labelText="job location"
                        value={jobLocation}
                        handleChange={handleJobInput}
                    />
                    <FormRowSelect
                        name="status"
                        value={status}
                        handleChange={handleJobInput}
                        list={statusOptions}
                    />
                    <FormRowSelect
                        name="jobType"
                        labelText="job type"
                        value={jobType}
                        handleChange={handleJobInput}
                        list={jobTypeOptions}
                    />
                    <div className="btn-container">
                        <button className="btn submit-btn">
                            submit
                        </button>
                        <button className="btn btn-block clear-btn" 
                        onClick={(event) => {
                            event.preventDefault()
                            clearValues()
                        }}>clear</button>
                    </div>
                </div>
            </form>
        </Wrapper>
    )
}

export default AddJob
