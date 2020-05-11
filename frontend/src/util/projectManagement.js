/**
 * Get uploaded projects from browser's local storage.
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
 * Get a project from browser's local storage.
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
 * Add a project to the list in browser's local storage.
 * @param {{}} project Project to save
 * @param {Function} chooseProject Function for choosing the project in App state
 */
export function saveProject(project, chooseProject) {
    let projects = getProjects();
    let projectAlreadySaved = false;
    // Check if the project we are saving is already in local storage.
    projects.forEach(value => {
        if (project.id === value.id) {
            projectAlreadySaved = true;
        }
    })
    // If the project is already saved, delete it from storage and push the new project.
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
 * Delete a project from local storage. Returns the updated `list` with the project removed.
 * @param {{}} project Project to delete
 * @param {Function} chooseProject Function for changing the current project in state
 * @returns {[Object]} `list` of `objects`
 */
export function deleteProject(project, chooseProject) {
    let projects = getProjects();
    const currentProject = loadCurrentProject();
    let newProjects = projects.filter(value => {
        if (value.id === project.id) {
            if (currentProject && currentProject.id === project.id) {
                chooseProject(null);
            }
            return false;
        }
        return true;
    });
    localStorage.setItem('uploadedProjects', JSON.stringify(newProjects));
    return newProjects;
}

/**
 * Save project as the currently active project in browser's local storage.
 * @param {Object} project Project to save
 */
export function saveCurrentProject(project) {
    try {
        localStorage.setItem('currentProject', JSON.stringify(project));
    } catch (error) {
        console.error("Saving an undefined project.", error);
    }
}

/**
 * Loads the project saved as the current project in browser's local storage.
 * @returns {{} | null} The project as an `object` or `null` if nothing is saved in local storage.
 */
export function loadCurrentProject() {
    let string = localStorage.getItem('currentProject');
    if (string) {
        let project = JSON.parse(string);
        return project;
    }
    return null;
}

/**
 * Saves a list of projects as the closest projects in the browser's local storage.
 * @param {[Object]} closestProjects List of objects
 */
export function saveClosestProjects(closestProjects) {
    localStorage.setItem('closestProjects', JSON.stringify(closestProjects));
}

/**
 * Fetches the closest projects stored in the browser's local storage.
 * Returns a `list` containing the closest projects as objects or `null` if local storage was empty.
 * @returns {[Object] | null} `[Object]` or `null`
 */
export function getClosestProjects() {
    let string = localStorage.getItem('closestProjects');

    if (string) {
        return JSON.parse(string);
    }
    return null;
}
