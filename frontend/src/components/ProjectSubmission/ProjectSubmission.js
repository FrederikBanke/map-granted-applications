import React, { useState, useEffect } from 'react'
import Overlay from '../Overlay/Overlay';
import { saveProject, getProjects, loadCurrentProject, saveCurrentProject, getProject, deleteProject } from '../../util/projectManagement';
import PropTypes from "prop-types";
import ReactTooltip from 'react-tooltip';

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
        border: "solid",
        padding: "10px"
    };

    useEffect(() => {
        setProjectsList(getProjects());
    }, [props.currentProject]);

    const onClickChoose = () => {
        setViewChooseProject(true);
    }
    

    const uploadProject = () => {
        let title = prompt("Project title") || "Unnamed project";
        let objective = prompt("Project objective") || "No objective";
        let id = prompt("Project id", getProjects().length+1) || "1";
        let newProject = {
            id,
            title,
            objective
        }
        saveProject(newProject, chooseProject);
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
        let newProjects = deleteProject(project, chooseProject);
        setProjectsList(newProjects);
    }

    const renderView = () => {
        return (
            <div>
                <button onClick={onClickChoose}>Choose new project</button><span style={{fontSize: "13px"}} data-tip="Upload a project with title and abstract. <br /> The abstract will be used to find the top n projects most similar to yours."> ❔</span>
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
                                            <p key={project.id}> <span onClick={onRemoveClick} data-projectid={project.id}>✖️</span> <span onClick={onProjectClick} data-projectid={project.id}>Title: {project.title}</span></p>
                                        ))
                                    }
                                    <button onClick={uploadProject}>Upload new project</button>
                                </div>
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