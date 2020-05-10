import React from 'react'
import PropTypes from 'prop-types'

const Tab = (props) => {
    const onClickHandler = () => {
        props.onClick(props.id);
    }

    return (
        <div style={props.styleFunc(props.id)} onClick={onClickHandler}>
            <p>{props.text}</p>
        </div>
    )
}

Tab.propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    styleFunc: PropTypes.func
}

export default Tab

