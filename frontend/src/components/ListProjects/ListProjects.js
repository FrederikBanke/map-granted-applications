import React from 'react'

export default function ListProjects(props) {

    const style = {
        height: "300px",
        width: "90%",
        overflowY: "scroll",
        margin: "auto"
    }

    return (
        <div style={style}>
            {
                props.projects.map((element, index) => {
                    return <p>{index + 1}: {element.title}</p>
                })
            }
        </div>
    )
}
