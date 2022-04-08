import React from 'react'
import Wrapper from "../assets/wrappers/SearchContainer"
import { useAppContext } from '../context/appContext'
import FormRow from "../components/FormRow"
import FormRowSelect from "../components/FormRowSelect"


const SearchContainer = () => {
    const {
        isLoading,
        search,
        searchStatus,
        searchType,
        sort,
        sortOptions,
        handleChange,
        clearFilters,
        jobTypeOptions,
        statusOptions
    } = useAppContext()

    const handleSearch = (event) => {
        if (isLoading) return
        handleChange({ name: event.target.name, value: event.target.value })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        clearFilters()
    }

    return (
        <Wrapper>
            <form className="form">
                <h4>Search form</h4>
                <div className="form-center">
                    <FormRow
                        type="text"
                        name="search"
                        value={search}
                        handleChange={handleSearch} />
                    <FormRowSelect
                        labelText="status"
                        name="searchStatus"
                        value={searchStatus}
                        handleChange={handleSearch}
                        list={["all", ...statusOptions]} />
                    <FormRowSelect
                        labelText="type"
                        name="searchType"
                        value={searchType}
                        handleChange={handleSearch}
                        list={["all", ...jobTypeOptions]} />
                    <FormRowSelect
                        name="sort"
                        value={sort}
                        handleChange={handleSearch}
                        list={sortOptions} />
                    <button className="btn btn-block btn-danger"
                        disabled={isLoading}
                        onClick={handleSubmit}>
                        Clear filters
                    </button>
                </div>
            </form>
        </Wrapper>
    )
}

export default SearchContainer