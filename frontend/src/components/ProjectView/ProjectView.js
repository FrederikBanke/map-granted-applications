import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { callApi } from '../../util/api';
import { getTertiaryColor } from '../../util/colors';
import ReactTooltip from 'react-tooltip';

/**
 * Type definition for Project.
 * @typedef {Object} Project
 * @property {string} id - 
 * @property {?string} acronym - 
 * @property {?string} title - 
 * @property {?string} objective - 
 * @property {?string} rcn - 
 * @property {?string} status - 
 * @property {?string} programme - 
 * @property {?string} topics - 
 * @property {?string} frameworkProgramme - 
 * @property {?string} startDate - 
 * @property {?string} endDate - 
 * @property {?string} projectUrl - 
 * @property {?string} totalCost - Total cost of project
 * @property {?string} ecMaxContribution - 
 * @property {?string} call - 
 * @property {?string} fundingScheme - 
 * @property {?string} coordinator - 
 * @property {?string} coordinatorCountry - 
 * @property {?string} participants - 
 * @property {?string} participantCountries - 
 */


/**
 * 
 * @param {Object} props 
 * @param {Project} props.project
 * @param {Function} props.onProjectChange
 * 
 */
const ProjectView = (props) => {
    const [project, setProject] = useState(props.project);
    const [objectiveStyle, setObjectiveStyle] = useState({ display: "block" });


    const containerStyle = {
        backgroundColor: "white",
        border: "solid"
    }

    const headerStyle = {
        color: getTertiaryColor()
    }

    /**
     * Checks if there is a project passed to it from parent,
     * if yes, set that project in state, 
     * if no, use project ID passed to look up in API.
     * Runs when ID or project changes.
     */
    useEffect(() => {
        if (props.project) {
            setProject(props.project)
        }
        else if (props.id) {
            callApi(`projects/${props.id}`)
                .then(project => {
                    setProject(project)
                })
        }

    }, [props.id, props.project]);

    /**
     * Calls callback function from App component to save the project.
     */
    const onSaveClick = () => {
        props.onProjectChange(project);
    }

    /**
     * Collapses objective text when header clicked.
     */
    const onClickObjective = () => {
        if (objectiveStyle.display === "none") {
            setObjectiveStyle({
                display: "block"
            });
        } else {
            setObjectiveStyle({
                display: "none"
            });
        }
    }

    /**
     * 
     * @param {String} text One string that will be split on ';'
     */
    const renderList = text => {
        let listOfThings = text.split(';')
        return (
            <ul>
                {
                    listOfThings.map((value, index) => (
                        <li>{value}</li>
                    ))
                }
            </ul>
        )
    }

    return (
        project
            ? (<div style={containerStyle}>
                <h1 style={headerStyle}>Title: {project.title}</h1>
                {project.acronym ? <p>Acronym: {project.acronym}</p> : null}
                <p>Project dates: {project.startDate} - {project.endDate} </p>
                <p>Funding: {project.ecMaxContribution} / {project.totalCost} </p>
                <h2 className="hover" onClick={onClickObjective} >Objective</h2>
                <p style={objectiveStyle}>{project.objective}</p>
                <br />
                {project.coordinator ? <p>Coordinator: {project.coordinator} {project.coordinatorCountry ? <span>({project.coordinatorCountry})</span> : null} </p> : null}
                {project.participants ? <p>Participants: {renderList(project.participants)} </p> : null}
                {project.projectUrl ? <p>Read more at: <a href={project.projectUrl}>{project.projectUrl}</a></p> : null}
                <button onClick={onSaveClick}>Save and set project as active</button><span style={{ fontSize: "13px" }} data-tip="Choose this project as the active project to find new closest projects."> ❔</span>
            <ReactTooltip place="right" effect="solid" multiline="true" />
            </div>)
            : null
    )
}

ProjectView.propTypes = {
    project: PropTypes.object,
    id: PropTypes.string,
    onProjectChange: PropTypes.func
}

export default ProjectView

