import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { callApi } from '../../util/api';
import { getPrimaryColor, getTertiaryColor } from '../../util/colors';

/**
 * The complete Triforce, or one or more components of the Triforce.
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
function ProjectView(props) {
    const [project, setProject] = useState(props.project);
    const [objectiveStyle, setObjectiveStyle] = useState({ display: "block" });


    const containerStyle = {
        backgroundColor: "white",
        border: "solid"
    }

    const headerStyle = {
        color: getTertiaryColor()
    }

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

    const onSaveClick = () => {

        props.onProjectChange(project);
    }

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

    return (
        project
            ? (<div style={containerStyle}>
                <h1 style={headerStyle}>Title: {project.title}</h1>
                <p>Acronym: {project.acronym}</p>
                <p>Project dates: {project.startDate} - {project.endDate} </p>
                <h2 onClick={onClickObjective} >Objective</h2>
                <p style={objectiveStyle}>{project.objective}</p>
                {project.projectUrl ? <p>Read more at: {project.projectUrl}</p> : null}
                <button onClick={onSaveClick}>Save and set project as active</button>
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

