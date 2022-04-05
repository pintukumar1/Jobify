import React, { useState } from 'react'
import { FormRow, Alert } from '../../components'
import Wrapper from '../../assets/wrappers/DashboardFormPage'
import { useAppContext } from '../../context/appContext'


const Profile = () => {
    const { user, showAlert, displayAlert, updateUser, isLoading } = useAppContext()
    const [name, setName] = useState(user?.name)
    const [lastName, setLastName] = useState(user?.lastName)
    const [email, setEmail] = useState(user?.email)
    const [location, setLocation] = useState(user?.location)

    const nameChangeHandler = (event) => {
        setName(event.target.value)
    }

    const lastNameChangeHandler = (event) => {
        setLastName(event.target.value)
    }

    const emailChangeHandler = (event) => {
        setEmail(event.target.value)
    }

    const locationChangeHandler = (event) => {
        setLocation(event.target.value)
    }

    const formSubmitHandler = (e) => {
        e.preventDefault()
        if (!name || !lastName || !email || !location) {
            displayAlert()
            return
        }
        updateUser({ name, lastName, email, location })
    }

    return (
        <Wrapper>
            <form className="form" onSubmit={formSubmitHandler}>
                <h3>profile</h3>
                {showAlert && <Alert />}
                <div className="form-center">
                    <FormRow
                        type="text"
                        name="name"
                        value={name}
                        handleChange={nameChangeHandler}
                    />
                    <FormRow
                        type="text"
                        name="lastname"
                        labelText="last name"
                        value={lastName}
                        handleChange={lastNameChangeHandler}
                    />
                    <FormRow
                        type="text"
                        name="email"
                        value={email}
                        handleChange={emailChangeHandler}
                    />
                    <FormRow
                        type="text"
                        name="location"
                        value={location}
                        handleChange={locationChangeHandler}
                    />
                    <button className="btn btn-block" type="submit" disabled={isLoading}>
                        {isLoading ? "Please wait..." : "save changes"}
                    </button>
                </div>
            </form>
        </Wrapper>
    )
}

export default Profile
