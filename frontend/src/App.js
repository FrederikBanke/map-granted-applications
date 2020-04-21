import React, { useState, useEffect } from 'react';
import './App.css';
import WordCloudContainer from './components/WordCloud/WordCloudContainer';
import callApi from './util/callApi';
import ListProjects from './components/ListProjects/ListProjects';
import ProjectSubmission from './components/ProjectSubmission/ProjectSubmission';


function App() {
  const [viewWordCloud, setViewWordCloud] = useState(false);
  const [viewWordCloud2, setViewWordCloud2] = useState(false);

  const [userProject, setUserProject] = useState(null);
  const [topProjects, setTopProjects] = useState([]);
  const [topNumber, setTopNumber] = useState(50);

  useEffect(() => {
    if (localStorage.getItem('userProject')) {
      setUserProject(JSON.parse(localStorage.getItem('userProject')));
    }
  }, []);

  useEffect(() => {
    if (userProject) {
      let closestProjects = localStorage.getItem('closestProjects')
      if (closestProjects) {
        let parsedProjects = JSON.parse(closestProjects)
        setTopProjects(parsedProjects)
      }
      else {
        console.log("Find new closest projects!");
        findClosest(userProject)
          .then(res => {
            console.log(res);

            localStorage.setItem('closestProjects', JSON.stringify(res))
            setTopProjects(res);
          });
      }
    }
  }, [userProject])

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

  const onProjectChange = project => {
    localStorage.removeItem('closestProjects');
    setTopProjects([]);
    setUserProject(project);
  }

  const inputStyle = { width: "50px" }

  return (
    <div className="App">
      <ProjectSubmission onChange={onProjectChange} />
      <hr />
      <ListProjects projects={subsetProjects(topProjects, topNumber)} />
      <br />
      <button onClick={toggleWordCloud}>Generate word cloud for your project</button>
      {viewWordCloud ? <WordCloudContainer projects={[userProject]} />
        : null
      }
      <br /><br />
      <input style={inputStyle} type="number" min={0} max={1000} onChange={onInputChange} value={topNumber} /> closest projects
      <br /><br />
      <button onClick={toggleWordCloud2}>Generate word cloud for closest projects</button>
      {viewWordCloud2 ? <WordCloudContainer projects={subsetProjects(topProjects, topNumber)} />
        : null
      }
    </div>
  );
}

export default App;
