import React from 'react'
import PropTypes from 'prop-types'

function TabsContainer(props) {
    const style = {
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "space-evenly",

    }
    return (
        <div style={style}>
            {
                React.Children.map(props.children, (child => (
                    child
                )))
            }
        </div>
    )
}

TabsContainer.propTypes = {

}

export default TabsContainer

