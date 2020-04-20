import React, { useState, useEffect } from 'react';
import './App.css';
import WordCloudContainer from './components/WordCloud/WordCloudContainer';
import { submitProject } from "./util/projectSubmission";
import callApi from './util/callApi';
import CustomSlider from './components/Sliders/CustomSlider';


function App() {
  const [viewWordCloud, setViewWordCloud] = useState(false);
  const [viewWordCloud2, setViewWordCloud2] = useState(false);

  const [topProjects, setTopProjects] = useState([]);
  const [topNumber, setTopNumber] = useState(50);

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

  /**
   * Combine project objectives.
   * @param {[]} projects 
   */
  const combineTexts = (projects, limit = 0) => {
    let subProjects = [];
    if (limit === 0) {
      subProjects = [];
    }
    else {
      subProjects = projects.slice(0, limit);
    }

    let totalString = "";
    subProjects.forEach(element => {
      totalString = totalString + element.objective;
    });
    console.log("All abstracts length", totalString.length);
    return totalString;
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

  const inputStyle = { width: "50px" }

  return (
    <div className="App">
      <input style={inputStyle} type="number" min={0} max={1000} onChange={onInputChange} value={topNumber} /> closest projects
      <br />
      <button onClick={toggleWordCloud}>Generate word cloud</button>
      {viewWordCloud ? <WordCloudContainer text={submitProject().objective} />
        : null
      }
      <br />
      <button onClick={toggleWordCloud2}>Generate word cloud 2</button>
      {viewWordCloud2 ? <WordCloudContainer text={combineTexts(topProjects, topNumber)} />
        : null
      }
    </div>
  );
}

export default App;
