import React, { useState, useEffect } from 'react';
import './App.css';
import WordCloudContainer from './components/WordCloud/WordCloudContainer';
import { submitProject } from "./util/projectSubmission";
import callApi from './util/callApi';

function App() {
  const [viewWordCloud, setViewWordCloud] = useState(false);
  const [topn, setTopn] = useState([]);

  useEffect(() => {
    findClosest();
  }, [])

  const toggleWordCloud = () => {
    setViewWordCloud(!viewWordCloud)
  }

  const findClosest = () => {
    callApi('closestprojects', 'POST', submitProject())
    .then(res => {
      console.log("Closest projects", res);
      
    });
  }

  return (
    <div className="App">
      <button onClick={toggleWordCloud}>Generate word cloud</button>
      {viewWordCloud ? <WordCloudContainer text={submitProject().objective} />
        : null
      }
    </div>
  );
}

export default App;
