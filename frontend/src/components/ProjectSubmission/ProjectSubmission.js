import React, { useState, useEffect } from 'react'
import Overlay from '../Overlay/Overlay';
import { saveProject, getProjects, loadCurrentProject, saveCurrentProject, getProject, deleteProject } from '../../util/projectManagement';


export default function ProjectSubmission(props) {
    const [projectsList, setProjectsList] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [viewChooseProject, setViewChooseProject] = useState(false);

    const chooseStyle = {
        backgroundColor: "white",
        border: "solid"
    };

    useEffect(() => {
        setCurrentProject(loadCurrentProject())
    }, [])

    useEffect(() => {
        setProjectsList(getProjects());
    }, [currentProject]);

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
        if (project) {
            if (currentProject) {
                if (project.id !== currentProject.id) {
                    localStorage.removeItem('closestProjects');
                    saveCurrentProject(project);
                    setCurrentProject(project);
                    props.onChange(project);
                }
            }
            else {
                localStorage.removeItem('closestProjects');
                saveCurrentProject(project);
                setCurrentProject(project);
                props.onChange(project);
            }
        }
        else {
            localStorage.removeItem('closestProjects');
            localStorage.removeItem('currentProject');
            setCurrentProject(project);
            props.onChange(project);
        }
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
                    currentProject ? <p>Title: {currentProject.title}</p> : null
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
