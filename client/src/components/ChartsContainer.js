import React, { useState } from 'react'
import BarChartComponent from './BarChart'
import Wrapper from "../assets/wrappers/ChartsContainer"
import { useAppContext } from "../context/appContext"
import AreaChartComponent from './AreaChart'

const ChartsContainer = () => {
    const [barChart, setBarChart] = useState(true)
    const { monthlyApplications } = useAppContext()
    return (
        <Wrapper>
            <h4>Monthly Applications</h4>
            <button onClick={() => setBarChart(!barChart)} >
                {barChart ? "AreaChart" : "BarChart"}
            </button>
            {barChart ?
                <BarChartComponent data={monthlyApplications} /> :
                <AreaChartComponent data={monthlyApplications} />
            }
        </Wrapper>
    )
}

export default ChartsContainer
