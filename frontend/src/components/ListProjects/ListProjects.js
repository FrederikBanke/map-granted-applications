import React, { useState } from 'react'
import { getSecondaryColor, getTertiaryColor, getPrimaryColor } from '../../util/colors'
import { subsetProjects } from '../../util/projects';
import Overlay from '../Overlay/Overlay';
import ProjectView from '../ProjectView/ProjectView';
import PropTypes from 'prop-types'

function ListProjects(props) {
    const [numberOfProjects, setNumberOfProjects] = useState(50);
    const [viewProject, setViewProject] = useState(false);
    const [projectId, setProjectId] = useState('');

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

    /**
     * Switch style for every other element.
     * @param {number} number index of current element
     * @returns {StyleSheet} CSS styles
     */
    const chooseElemStyle = number => {
        if ((number % 2) === 0) {
            return projectStyle1;
        }
        return projectStyle2;
    }

/**
 * When input changes, change state. If input is set to something greater than 1000, set state to 1000.
 * @param {Event} event DOM event
 */
    const onInputChange = event => {
        let value = parseInt(event.target.value);
        if (isNaN(value)) {
            value = 0;
        }
        if (value > 1000) {
            setNumberOfProjects(1000);
        }
        if (0 <= value && value <= 1000) {
            setNumberOfProjects(value);
        }
    }

    /**
     * 
     * @param {String} objective 
     */
    const renderObjevtive = (objective) => {
        if (objective.length <= 150) {
            return objective
        }
        return objective.substr(0, 150) + "...";
    }

    /**
     * Extract project id from element. Set project ID in state, and view overlay.
     * @param {Event} event DOM event
     */
    const onProjectClick = (event) => {
        const clickedProjectId = event.target.getAttribute('data-projectid');
        setProjectId(clickedProjectId);
        setViewProject(true);
    }

    const renderProjectOverlay = (overlayClickClose, onProjectChange, projectId) => {
        return <Overlay onClickClose={overlayClickClose}>
            <ProjectView onProjectChange={onProjectChange} id={projectId} />
        </Overlay>
    }

    return (
        <div style={containerStyle}>
            {
                viewProject ? renderProjectOverlay(setViewProject, props.onProjectChange, projectId) : null
            }
            <h2 style={headerStyle}>List of closest projects</h2>
            < input style={inputStyle} type="number" min={0} max={1000} onChange={onInputChange} value={numberOfProjects} /> closest projects
            <div style={listStyle}>
                {
                    subsetProjects(props.projects, numberOfProjects).map((element, index) => {
                        return <div key={element.id} style={chooseElemStyle(index)} onClick={onProjectClick} data-projectid={element.id} >
                            <h4 style={headerStyle} data-projectid={element.id} >{index + 1}: {element.title}</h4>
                            <p style={objectiveStyle} >{renderObjevtive(element.objective)}</p>
                        </div>
                    })
                }
            </div>
        </div>
    )
}



ListProjects.propTypes = {
    projects: PropTypes.arrayOf(Object),
    onProjectChange: PropTypes.func.isRequired
}

export default ListProjects;

