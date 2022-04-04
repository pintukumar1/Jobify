import React, { useReducer, useContext } from "react";
import axios from "axios"
import {
    CLEAR_ALERT,
    DISPLAY_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_ERROR,
    REGISTER_USER_SUCCESS,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    TOOGLE_SIDEBAR,
    LOGOUT_USER
} from "./actions";
import reducer from "./reducer";

const user = localStorage.getItem("user")
const token = localStorage.getItem("token")
const userLocation = localStorage.getItem("location")

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user || null,
    token: token,
    userLocation: userLocation || "",
    jobLocation: userLocation || ""
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT })
        clearAlert()
    }

    const clearAlert = () => {
        setTimeout(() => {
            dispatch({
                type: CLEAR_ALERT
            })
        }, 3000)
    }

    const addUserToLocalStorage = ({ user, token, location }) => {
        localStorage.setItem("user", user)
        localStorage.setItem("token", token)
        localStorage.setItem("location", location)
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        localStorage.removeItem("location")
    }

    const registerUser = async (currentUser) => {
        dispatch({ type: REGISTER_USER_BEGIN })
        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", currentUser)
            const { user, token, location } = response.data
            dispatch({ type: REGISTER_USER_SUCCESS, payload: { user, token, location } })
            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            dispatch({ type: REGISTER_USER_ERROR, payload: { msg: error.response.data.msg } })
        }
        clearAlert()
    }

    const loginUser = async (currentUser) => {
        dispatch({ type: LOGIN_USER_BEGIN })
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", currentUser)
            const { user, token, location } = response.data
            dispatch({ type: LOGIN_USER_SUCCESS, payload: { user, token, location } })
            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            dispatch({ type: LOGIN_USER_ERROR, payload: { msg: error.response.data.msg } })
        }
        clearAlert()
    }

    const toggleSidebar = () => {
        dispatch({ type: TOOGLE_SIDEBAR })
    }

    const logoutUser = () => {
        dispatch({type: LOGOUT_USER})
        removeUserFromLocalStorage()
    }

    return (
        <AppContext.Provider value={{
            ...state,
            displayAlert,
            registerUser,
            loginUser,
            toggleSidebar,
            logoutUser
        }}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }