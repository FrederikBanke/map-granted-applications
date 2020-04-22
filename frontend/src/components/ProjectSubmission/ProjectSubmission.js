import React, { useState, useEffect } from 'react'
import Overlay from '../Overlay/Overlay';
import { saveProject, getProjects, loadCurrentProject, saveCurrentProject, getProject, deleteProject } from '../../util/projectManagement';
import PropTypes from "prop-types";

/**
 * 
 * @param {Object} props 
 * @param {Object} props.currentProject
 * @param {Function} props.onChange
 */
export default function ProjectSubmission(props) {
    const [projectsList, setProjectsList] = useState([]);
    const [viewChooseProject, setViewChooseProject] = useState(false);

    const chooseStyle = {
        backgroundColor: "white",
        border: "solid"
    };

    useEffect(() => {
        setProjectsList(getProjects());
    }, [props.currentProject]);

    const onClickChoose = () => {
        setViewChooseProject(true);
    }

    const uploadProject = () => {
        let title = prompt("Project title") || "";
        let objective = prompt("Project objective") || "";
        let id = prompt("Project id") || "1";
        let newProject = {
            id,
            title,
            objective
        }
        saveProject(newProject);
        chooseProject(newProject);
    }

    const chooseProject = project => {
        props.onChange(project);
    }

    const onProjectClick = event => {
        let projectId = event.target.getAttribute('data-projectid');
        let project = getProject(projectId);
        chooseProject(project);
    }

    const onRemoveClick = event => {
        let projectId = event.target.getAttribute('data-projectid');
        let project = getProject(projectId);
        deleteProject(project, chooseProject);
    }

    const renderView = () => {
        return (
            <div>
                <button onClick={onClickChoose}>Choose new project</button>
                {
                    props.currentProject ? <p>Title: {props.currentProject.title}</p> : null
                }
                {
                    viewChooseProject
                        ? (
                            <Overlay onClickClose={setViewChooseProject}>
                                <div style={chooseStyle}>
                                    {
                                        projectsList.map((project, index) => (
                                            <p> <span onClick={onRemoveClick} data-projectid={project.id}>✖️</span> <span onClick={onProjectClick} data-projectid={project.id}>Title: {project.title}</span></p>
                                        ))
                                    }
                                </div>
                                <button onClick={uploadProject}>Upload new project</button>
                            </Overlay>
                        ) : null
                }

            </div>
        )

    }

    return renderView();
}

ProjectSubmission.propTypes = {
    currentProject: PropTypes.object,
    onChange: PropTypes.func
}