import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import callApi from '../../util/callApi';

/**
 * 
 * @param {Object} props 
 * @param {Object} props.project
 * @param {String} props.id
 * @param {Function} props.onProjectChange
 * 
 */
function ProjectView(props) {
    const [project, setProject] = useState(null);


    const style = {
        backgroundColor: "white",
        border: "solid"
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

    return (
        project
            ? (<div style={style}>
                <p>Title: {project.title}</p>
                <p>Objective: {project.objective}</p>
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

