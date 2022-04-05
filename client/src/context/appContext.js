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
    LOGOUT_USER,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR
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
    showSidebar: false,
    user: user,
    token: token,
    userLocation: userLocation || "",
    jobLocation: userLocation || ""
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    // Authorization Global setup for Bearer Token
    // axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}` 

    const authFetch = axios.create({
        baseURL: "http://localhost:5000/api",
    })

    //request
    authFetch.interceptors.request.use(
        (config) => {
            config.headers.common["Authorization"] = `Bearer ${state.token}`
            return config
        },
        (error) => {
            return Promise.reject(error)
        })

    // response
    authFetch.interceptors.response.use(
        (response) => {
        return response
    }, (error) => {
        console.log(error.response)
        if (error.response.status === 401) {
            logoutUser()
        }
        return Promise.reject(error)
    })

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
        dispatch({ type: LOGOUT_USER })
        removeUserFromLocalStorage()
    }

    const updateUser = async (currentUser) => {
        dispatch({ type: UPDATE_USER_BEGIN })
        try {
            const response = await authFetch.patch("/auth/updateuser", currentUser)
            const data = response.data;
            const { user, location, token } = data
            dispatch({ type: UPDATE_USER_SUCCESS, payload: { user, location, token } })
            addUserToLocalStorage({ user, location, token })
        } catch (err) {
            if (err.response.status !== 401) {
                dispatch({ type: UPDATE_USER_ERROR, payload: { msg: err.response.data.msg } })
            }
        }
        clearAlert()
    }

    return (
        <AppContext.Provider value={{
            ...state,
            displayAlert,
            registerUser,
            loginUser,
            toggleSidebar,
            logoutUser,
            updateUser
        }}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }