import React, { useState, useEffect } from 'react';
import './App.css';
import WordCloudContainer from './components/WordCloud/WordCloudContainer';
import callApi from './util/callApi';
import ListProjects from './components/ListProjects/ListProjects';
import ProjectSubmission from './components/ProjectSubmission/ProjectSubmission';
import { loadCurrentProject, getClosestProjects, saveClosestProjects, saveCurrentProject, saveProject } from './util/projectManagement';


function App() {
  const [viewWordCloud, setViewWordCloud] = useState(false);
  const [viewWordCloud2, setViewWordCloud2] = useState(false);

  const [uploadedProjects, setUploadedProjects] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [topProjectsList, setTopProjectsList] = useState(null);
  const [topProjects, setTopProjects] = useState([]);
  const [topNumber, setTopNumber] = useState(50);

  useEffect(() => {
    setCurrentProject(loadCurrentProject());
  }, []);

  useEffect(() => {
    if (currentProject) {
      let closestProjects = getClosestProjects();
      if (closestProjects) {
        setTopProjects(closestProjects);
      }
      else {
        console.log("Find new closest projects!");
        findClosest(currentProject)
          .then(newClosestProjects => {
            console.log(newClosestProjects);

            saveClosestProjects(newClosestProjects);
            setTopProjects(newClosestProjects);
          });
      }
    }
  }, [currentProject])

  const toggleWordCloud = () => {
    setViewWordCloud(!viewWordCloud)
  }
  const toggleWordCloud2 = () => {
    setViewWordCloud2(!viewWordCloud2)
  }

  const findClosest = (project) => {
    return callApi('closestprojects', 'POST', project);
  }

  const subsetProjects = (projects, limit) => {
    let subProjects = [];
    if (limit === 0) {
      subProjects = [];
    }
    else {
      subProjects = projects.slice(0, limit);
    }
    return subProjects;
  }

  const onInputChange = event => {
    setViewWordCloud2(false);
    let value = parseInt(event.target.value);
    if (isNaN(value)) {
      value = 0;
    }
    if (0 <= value && value <= 1000) {
      setTopNumber(value);
    }
  }

  const currentProjectExists = () => {
    if (currentProject) {
      return true;
    }
    return false;
  }

  const saveAndSetProject = project => {
    if (project) {
      saveProject(project);
    }
    onProjectChange(project);
  }

  const onProjectChange = project => {
    setViewWordCloud(false);
    setViewWordCloud2(false);
    if (project) {
      if (currentProject) {
        if (project.id !== currentProject.id) {
          localStorage.removeItem('closestProjects');
          saveCurrentProject(project);
          setTopProjects([]);
          setCurrentProject(project);
        }
      } else {
        localStorage.removeItem('closestProjects');
        saveCurrentProject(project);
        setTopProjects([]);
        setCurrentProject(project);
      }
    }
    else {
      localStorage.removeItem('closestProjects');
      localStorage.removeItem('currentProject');
      setCurrentProject(null);
      setTopProjects([]);
    }
  }

  const inputStyle = { width: "50px" }

  return (
    <div className="App">
      <ProjectSubmission currentProject={currentProject} onChange={onProjectChange} />
      <hr />
      <button disabled={!currentProjectExists()} onClick={toggleWordCloud}>Generate word cloud for your project</button>
      {viewWordCloud ? <WordCloudContainer onProjectChange={onProjectChange} projects={[currentProject]} />
        : null
      }
      {
        topProjects.length > 0
          ? <ListProjects projects={subsetProjects(topProjects, topNumber)} />
          : null
      }
      <br />
      <br /><br />
      <input style={inputStyle} type="number" min={0} max={1000} onChange={onInputChange} value={topNumber} /> closest projects
      <br /><br />
      <button disabled={topProjects.length < 1} onClick={toggleWordCloud2}>Generate word cloud for closest projects</button>
      {viewWordCloud2 ? <WordCloudContainer onProjectChange={saveAndSetProject} projects={subsetProjects(topProjects, topNumber)} />
        : null
      }
    </div>
  );
}

export default App;
