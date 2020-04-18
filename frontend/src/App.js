import React, { useState } from 'react';
import './App.css';
import WordCloudContainer from './components/WordCloud/WordCloudContainer';
import { submitProject } from "./util/projectSubmission";

function App() {
  const [viewWordCloud, setViewWordCloud] = useState(false)

  const toggleWordCloud = () => {
    setViewWordCloud(!viewWordCloud)
  }

  return (
    <div className="App">
      <button onClick={toggleWordCloud}>Generate word cloud</button>
      {viewWordCloud ? <WordCloudContainer text={submitProject().abstract}/>
        : null
      }
    </div>
  );
}

export default App;
