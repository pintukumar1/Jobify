import React from 'react'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi"
import Wrapper from '../assets/wrappers/PageBtnContainer'
import { useAppContext } from '../context/appContext'

const PageBtnContainer = () => {
    const { numOfPages, page, changePage } = useAppContext()

    const pages = Array.from({ length: numOfPages }, (_, index) => {
        return index + 1
    })

    const nextPage = () => {
        let newPage = page + 1
        if (newPage > numOfPages) {
            newPage = 1
        }
        changePage(newPage)
    }

    const prevPage = () => {
        let newPage = page - 1
        if (newPage < 1) {
            newPage = numOfPages
        }
        changePage(newPage)
    }

    return (
        <Wrapper>
            <button className="prev-btn" onClick={prevPage}>
                <HiChevronDoubleLeft />
                prev
            </button>
            {pages.map((pageNumber) => {
                return <button
                    type="button"
                    key={pageNumber}
                    className={pageNumber === page ? "pageBtn active" : "pageBtn"}
                    onClick={() => changePage(pageNumber)}
                >
                    {pageNumber}
                </button>
            })}
            <button className="next-btn" onClick={nextPage}>
                Next
                <HiChevronDoubleRight />
            </button>
        </Wrapper>
    )
}

export default PageBtnContainer
