import React from 'react'
import PropTypes from 'prop-types'
import "./Tab.css"

const Tab = (props) => {
    const onClickHandler = () => {
        if (props.isEnabled) {   
            props.onClick(props.id);
        }
    }

    return (
        <div>

        <button className="tabButton" style={props.styleFunc(props.id)} onClick={onClickHandler}>
            {props.text}
        </button>
        {React.Children.map(props.children, child => child)}
        </div>
    )
}

Tab.propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    styleFunc: PropTypes.func,
    isEnabled: PropTypes.bool,
}

export default Tab

