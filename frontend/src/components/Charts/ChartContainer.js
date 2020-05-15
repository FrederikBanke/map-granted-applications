import React from 'react'
import PropTypes from 'prop-types'

const ChartContainer = props => {
    const chartContainerStyle = {
        display: "flex",
        width: "100%",
        height: "fit-content",
        maxHeight: "100%",
        flexFlow: "column"
    }

    return (
        <div style={chartContainerStyle}>
            {
                React.Children.map(props.children, child => (
                    child
                ))
            }
        </div >
    )
}

ChartContainer.propTypes = {

}

export default ChartContainer
