import React from 'react'
import PropTypes from 'prop-types'

function Overlay(props) {
    const overlayStyle = {
        position: "fixed", /* Sit on top of the page content */
        width: "fit-content", /* Full width (cover the whole page) */
        height: "fit-content", /* Full height (cover the whole page) */
        top: "50px",
        left: "50px",
        right: "50px",
        zIndex: "2", /* Specify a stack order in case you're using a different order for other elements */
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

