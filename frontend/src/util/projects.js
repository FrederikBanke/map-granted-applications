/**
 * Get a subset of projects.
 * @param {[Object]} projects Full project list
 * @param {number} limit How many projects to return
 * @returns {[]} A list of subset
 */
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


/**
* Combine project objectives.
* @param {[]} projects List of projects to combine
* @returns {string} Combined string
*/
export const combineTexts = (projects) => {
  let totalString = "";
  projects.forEach(project => {
    totalString = totalString + " " + project.objective;
  });

  return totalString;
}

/**
 * Seperate project objectives by year.
 * @param {[]} projects 
 * @returns {{}} An `object` with the year as key.
 */
export const groupProjectsByYear = (projects) => {
  let projectsByYear = {};

  projects.forEach(value => {
    let date = new Date(value.startDate);
    let year = date.getUTCFullYear().toString();

    if (Object.keys(projectsByYear).includes(year)) {
      projectsByYear[year].push(value);
    } else {
      // console.log(`${year} was not in object`);
      projectsByYear[year] = [value];
    }
  });
  return projectsByYear;
}

/**
 * Return project objectives in a list.
 * @param {[]} projects 
 * @returns {[]} A `list` containing project objectives.
 */
export const extractProjectObjectives = projects => {
  let objectives = [];
  projects.forEach(project => {
    objectives.push(project.objective);
  });
  return objectives;
}