/**
 * Get uploaded projects from local storage.
 * @returns {[]}
 */
export function getProjects() {
    let string = localStorage.getItem('uploadedProjects')
    if (string) {
        let projects = JSON.parse(string);
        return projects;
    }
    return [];
}

/**
 * Get a project from local storage.
 * @param {String} projectId ID of the project to get
 * @returns {{}} The project with the provided id
 */
export function getProject(projectId) {
    let projects = getProjects();
    return projects.find(project => {
        if (projectId === project.id) {
            return true;
        }
    })
}

/**
 * Add a project to the list in local storage.
 * @param {{}} project Project to save
 */
export function saveProject(project, chooseProject) {
    let projects = getProjects();
    let projectAlreadySaved = false;
    projects.forEach(value => {
        if (project.id === value.id) {
            projectAlreadySaved = true;
        }
    })
    if (projectAlreadySaved) {
        projects = deleteProject(project, chooseProject);
        projects.push(project);
        
    }
    else {
        projects.push(project);

    }
    localStorage.setItem('uploadedProjects', JSON.stringify(projects));
}

/**
 * Delete a project from local storage.
 * @param {{}} project Project to delete
 * @param {Function} chooseProject
 */
export function deleteProject(project, chooseProject) {
    let projects = getProjects();
    let newProjects = projects.filter(value => {
        if (value.id === project.id) {
            if (loadCurrentProject().id === project.id) {
                chooseProject(null);
            }
            return false;
        }
        return true;
    });
    localStorage.setItem('uploadedProjects', JSON.stringify(newProjects));
    return newProjects;
}

export function saveCurrentProject(project) {
    if (project === null || project === undefined) {
        console.error("Saving an undefined project");
    }
    else {
        localStorage.setItem('currentProject', JSON.stringify(project));
    }
}

/**
 * @returns {{}}
 */
export function loadCurrentProject() {
    let string = localStorage.getItem('currentProject');
    if (string) {
        let project = JSON.parse(string);
        return project;
    }
    return null;
}

export function saveClosestProjects(closestProjects) {
    localStorage.setItem('closestProjects', JSON.stringify(closestProjects));
}

export function getClosestProjects() {
    let string = localStorage.getItem('closestProjects');

    if (string) {
        return JSON.parse(string);
    }
    return null;
}
