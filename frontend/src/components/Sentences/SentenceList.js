import React from 'react'
import PropTypes from 'prop-types'

const SentenceList = props => {

    const containerStyle = {
        width: "90%",
        height: "600px",
        overflowY: "auto",
        margin: "auto",
        // marginBottom: "30px",
    }

    return (
        <div style={containerStyle}>
            {React.Children.map(props.children, child => child)}
        </div>
    )
}

SentenceList.propTypes = {

}

export default SentenceList
