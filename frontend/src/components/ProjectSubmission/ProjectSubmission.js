import React, { useState, useEffect } from 'react'


export default function ProjectSubmission(props) {
    const [project, setProject] = useState(null);

    useEffect(() => {
        let localProject = localStorage.getItem('userProject');
        if (localProject) {
            setProject(JSON.parse(localProject));
        }
    }, []);

    const onClick = () => {
        uploadProject(project)
    }

    const uploadProject = (prevProject) => {
        let newProject = {};
        if (prevProject) {
            let title = prompt("Project title", prevProject.title) || "";
            let objective = prompt("Project objective", prevProject.objective) || "";
            newProject = {
                id: "1",
                title,
                objective
            }
        }
        else {
            let title = prompt("Project title") || "";
            let objective = prompt("Project objective") || "";
            newProject = {
                id: "1",
                title,
                objective
            }
        }
        localStorage.setItem('userProject', JSON.stringify(newProject));
        setProject(newProject);
        props.onChange(newProject);
    }

    const removeLocalProject = () => {
        localStorage.removeItem('userProject');
    }

    const renderView = () => {
        return project ? (
            <div>
                <button onClick={onClick}>Upload new project</button>
                <p>Title: {project.title}</p>
            </div>
        )
        : (
            <div>
                <button onClick={onClick}>Upload new project</button>
                <p>No project found</p>
            </div>
        )
    }

    return renderView();
}
