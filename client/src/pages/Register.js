import { useState, useEffect } from 'react';
import { useNavigate} from  'react-router-dom'
import { Logo, FormRow, Alert } from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'
import { useAppContext } from '../context/appContext';

const initialState = {
    name: '',
    email: '',
    password: '',
    isMember: true,
}
const Register = () => {
    const navigate = useNavigate();
    const { user, isLoading, showAlert, displayAlert, registerUser, loginUser } = useAppContext()
    const [values, setValues] = useState(initialState)

    const toggleMember = () => {
        setValues({ ...values, isMember: !values.isMember })
    }

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const { name, email, password, isMember } = values
        const currentUser = { name, email, password }
        if (isMember) {
            loginUser(currentUser)
        } else {
            registerUser(currentUser)
        }
    }

    useEffect(() => {
        if(user) {
            setTimeout(() => {
                navigate("/")
            }, 3000)
        }
    }, [user, navigate])

    return (
        <Wrapper className="full-page">
            <form className="form" onSubmit={onSubmit}>
                <Logo />
                <h3>{values.isMember ? "Login" : "Register"}</h3>
                {showAlert && <Alert />}
                {/* name input */}
                {!values.isMember && <FormRow
                    type="text"
                    name="name"
                    handleChange={handleChange}
                    value={values.name} />
                }

                {/* email input */}
                <FormRow
                    type="text"
                    name="email"
                    handleChange={handleChange}
                    value={values.email} />
                {/* password input */}
                <FormRow
                    type="password"
                    name="password"
                    handleChange={handleChange}
                    value={values.password} />
                <button type="submit" className="btn btn-block" disabled={isLoading}>
                    submit
                </button>
                <p>
                    {values.isMember ? "Not a member yet ?" : "Already a member ?"}
                    <button type="button" className="member-btn" onClick={toggleMember}>
                        {values.isMember ? "Register" : "Login"}
                    </button>
                </p>
            </form>
        </Wrapper>
    )
}

export default Register
