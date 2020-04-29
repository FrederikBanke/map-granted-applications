export const subsetProjects = (projects, limit) => {
    let subProjects = [];
    if (limit === 0) {
      subProjects = [];
    }
    else {
      subProjects = projects.slice(0, limit);
    }
    return subProjects;
  }