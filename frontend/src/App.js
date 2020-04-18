import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import ProjectSubmission from './components/ProjectSubmission/ProjectSubmission';
import WordCloud from './components/WordCloud/WordCloud';

function App() {
  const [viewWordCloud, setViewWordCloud] = useState(false)

  const toggleWordCloud = () => {
    setViewWordCloud(!viewWordCloud)
  }

  return (
    <div className="App">
      <ProjectSubmission />
      <button onClick={toggleWordCloud}>Generate word cloud</button>
      {viewWordCloud ? <WordCloud />
        : null
      }
    </div>
  );
}

export default App;
