import React, { useState } from 'react'
import { getSecondaryColor, getTertiaryColor, getPrimaryColor, getQuinaryColor, getQuaternaryColor } from '../../util/colors'
import { subsetProjects } from '../../util/subsetProjects';

export default function ListProjects(props) {
    const [numberOfProjects, setNumberOfProjects] = useState(50);

    const containerStyle = {
        height: "400px",
        width: "90%",
        margin: "auto",
        // backgroundColor: getPrimaryColor(),
        // color: "whitesmoke",
    }

    const listStyle = {
        height: "80%",
        // width: "90%",
        overflowY: "scroll",
        // margin: "auto",
        backgroundColor: getPrimaryColor(),
        color: "whitesmoke",
    }

    const projectStyle1 = {
        margin: 0,
        // backgroundColor: "#404040",
        backgroundColor: getTertiaryColor(),
        color: "whitesmoke",
        paddingBottom: "10px",
    }

    const projectStyle2 = {
        backgroundColor: getSecondaryColor(),
        color: "whitesmoke",
        margin: 0,
        paddingBottom: "10px",
    }

    const headerStyle = {
        margin: 0,
        marginBottom: "5px"
    }

    const objectiveStyle = {
        margin: 0,
        // marginBottom: "30px"
    }

    const inputStyle = { width: "50px" }

    const chooseElemStyle = number => {
        if ((number % 2) === 0) {
            return projectStyle1;
        }
        return projectStyle2;
    }

    const onInputChange = event => {
        let value = parseInt(event.target.value);
        if (isNaN(value)) {
            value = 0;
        }
        if (0 <= value && value <= 1000) {
            setNumberOfProjects(value);
        }
    }

    return (
        <div style={containerStyle}>
            <h2 style={headerStyle}>List of closest projects</h2>
            < input style={inputStyle} type="number" min={0} max={1000} onChange={onInputChange} value={numberOfProjects} /> closest projects
            <div style={listStyle}>
                {
                    subsetProjects(props.projects, numberOfProjects).map((element, index) => {
                        return <div key={element.id} style={chooseElemStyle(index)}>
                            <h4 style={headerStyle}>{index + 1}: {element.title}</h4>
                            <p style={objectiveStyle}>{element.objective.substr(0, 50)}...</p>
                        </div>
                    })
                }
            </div>
        </div>
    )
}
