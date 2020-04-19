import React, { useState, useEffect } from 'react';
import './App.css';
import WordCloudContainer from './components/WordCloud/WordCloudContainer';
import { submitProject } from "./util/projectSubmission";
import callApi from './util/callApi';

function App() {
  const [viewWordCloud, setViewWordCloud] = useState(false);
  const [viewWordCloud2, setViewWordCloud2] = useState(false);

  const [topProjects, setTopProjects] = useState([]);

  useEffect(() => {
    let closestProjects = localStorage.getItem('closestProjects')
    if (closestProjects) {
      let parsedProjects = JSON.parse(closestProjects)
      setTopProjects(parsedProjects)
    }
    else {
      console.log("Find new closest projects!");
      findClosest()
        .then(res => {
          localStorage.setItem('closestProjects', JSON.stringify(res))
          setTopProjects(res);
        });



    }
  }, [])

  const toggleWordCloud = () => {
    setViewWordCloud(!viewWordCloud)
  }
  const toggleWordCloud2 = () => {
    setViewWordCloud2(!viewWordCloud2)
  }

  const findClosest = () => {
    return callApi('closestprojects', 'POST', submitProject());
  }

  const combineTexts = (projects) => {
    let totalString = "";
    projects.forEach(element => {
      totalString = totalString + element.objective;
    });
    return totalString;
  }

  return (
    <div className="App">
      <button onClick={toggleWordCloud}>Generate word cloud</button>
      {viewWordCloud ? <WordCloudContainer text={submitProject().objective} />
        : null
      }
      <br/>
      <button onClick={toggleWordCloud2}>Generate word cloud 2</button>
      {viewWordCloud2 ? <WordCloudContainer text={combineTexts(topProjects)} />
        : null
      }
    </div>
  );
}

export default App;
