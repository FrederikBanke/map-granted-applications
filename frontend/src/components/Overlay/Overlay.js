import React from 'react'
import PropTypes from 'prop-types'

function Overlay(props) {
    const overlayStyle = {
        position: "fixed",
        margin: "auto",
        width: "fit-content",
        maxWidth: "90%",
        height: "fit-content", 
        top: "50px",
        left: "50px",
        right: "50px",
        zIndex: "2",
    }

    const onClickClose = () => {
        props.onClickClose(false);
    }


    return (
        <div style={overlayStyle}>
            <button onClick={onClickClose} style={{float: "left"}}>Close</button>
            {
                React.Children.map(props.children, (child => (
                    child
                )))
            }
        </div>
    )
}

Overlay.propTypes = {
    onClickClose: PropTypes.func.isRequired
}

export default Overlay

