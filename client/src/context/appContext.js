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
    UPDATE_USER_ERROR,
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
    GET_JOBS_BEGIN,
    GET_JOBS_SUCCESS,
    SET_EDIT_JOB,
    DELETE_JOB_BEGIN,
    EDIT_JOB_BEGIN,
    EDIT_JOB_ERROR,
    EDIT_JOB_SUCCESS,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    CLEAR_FILTERS,
    CHANGE_PAGE
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
    user: user,
    token: token,
    userLocation: userLocation || "",
    showSidebar: false,
    isEditing: false,
    editJobId: "",
    position: "",
    company: "",
    jobLocation: userLocation || "",
    jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
    jobType: "full-time",
    statusOptions: ["interview", "declined", "pending"],
    status: "pending",
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,
    stats: {},
    monthlyApplications: [] ,
    search: "",
    searchStatus: "all",
    searchType: "all",
    sort: "latest",
    sortOptions: ["latest", "oldest", "a-z", "z-a"]
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    // Authorization Global setup for Bearer Token
    // axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}` 

    const authFetch = axios.create({
        baseURL: "/api",
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
            const response = await axios.post("/api/auth/register", currentUser)
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
            const response = await axios.post("/api/auth/login", currentUser)
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

    const handleChange = ({ name, value }) => {
        dispatch({ type: HANDLE_CHANGE, payload: { name, value } })
    }

    const clearValues = () => {
        dispatch({ type: CLEAR_VALUES })
    }

    const createJob = async () => {
        dispatch({ type: CREATE_JOB_BEGIN })
        try {
            const { position, company, jobLocation, jobType, status } = state
            await authFetch.post("/job",
                {
                    position,
                    company,
                    jobLocation,
                    jobType,
                    status
                })
            dispatch({ type: CREATE_JOB_SUCCESS })
            dispatch({ type: CLEAR_VALUES })
        } catch (error) {
            if (error.response.status === 401) return
            dispatch({
                type: CREATE_JOB_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
        clearAlert()
    }

    const getAllJobs = async () => {
        const { page, search, searchStatus, searchType, sort } = state
        let url = `/job?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
        if (search) {
            url = url + `&search=${search}`
        }

        dispatch({ type: GET_JOBS_BEGIN })
        try {
            const { data } = await authFetch(url)
            const { job, totalJobs, numOfPages } = data
            dispatch({ type: GET_JOBS_SUCCESS, payload: { job, totalJobs, numOfPages } })
        } catch (error) {
            logoutUser()
        }
        clearAlert()
    }

    const setEditJob = (id) => {
        dispatch({ type: SET_EDIT_JOB, payload: { id: id } })
    }

    const editJob = async () => {
        dispatch({ type: EDIT_JOB_BEGIN })
        try {
            const { position, company, jobLocation, jobType, status } = state
            await authFetch.patch(`/job/${state.editJobId}`, {
                company, position, jobLocation, jobType, status
            })
            dispatch({ type: EDIT_JOB_SUCCESS })
            dispatch({ type: CLEAR_VALUES })
        } catch (error) {
            if (error.response.status === 401) return
            dispatch({ type: EDIT_JOB_ERROR, payload: { msg: error.response.data.msg } })
        }
    }

    const deleteJob = async (jobId) => {
        dispatch({ type: DELETE_JOB_BEGIN })
        try {
            await authFetch.delete(`/job/${jobId}`)
            getAllJobs()
        } catch (err) {
            logoutUser() 
        }
    }

    const showStats = async () => {
        dispatch({ type: SHOW_STATS_BEGIN })
        try {
            const { data } = await authFetch("/job/stats")
            
            dispatch({
                type: SHOW_STATS_SUCCESS, payload: {
                    stats: data.defaultStats,
                    monthlyApplications: data.monthlyApplications
                }
            })
        }
        catch (error) {
            logoutUser()
        }
    }

    const clearFilters = () => {
        dispatch({ type: CLEAR_FILTERS })
    }

    const changePage = (page) => {
        dispatch({ type: CHANGE_PAGE, payload: { page } })
    }

    return (
        <AppContext.Provider value={{
            ...state,
            displayAlert,
            registerUser,
            loginUser,
            toggleSidebar,
            logoutUser,
            updateUser,
            handleChange,
            clearValues,
            createJob,
            getAllJobs,
            setEditJob,
            editJob,
            deleteJob,
            showStats,
            clearFilters,
            changePage
        }}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }