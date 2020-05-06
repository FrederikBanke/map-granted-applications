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
* @param {[]} projects 
*/
export const combineTexts = (projects) => {
  let totalString = "";
  projects.forEach(project => {
    totalString = totalString + " " + project.objective;
  });
  // console.log("All abstracts length", totalString.length);
  // console.log("Combined abstract", totalString);

  return totalString;
}

/**
 * Seperate project objectives by year.
 * @param {[]} projects 
 * @returns {{}}
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
 * @returns {[]}
 */
export const extractProjectObjectives = projects => {
  let objectives = [];
  projects.forEach(project => {
    objectives.push(project.objective);
  });
  return objectives;
}