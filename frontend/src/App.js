import React, { useState, useEffect } from 'react';
import './App.css';
import WordCloudContainer from './components/WordCloud/WordCloudContainer';
import { callApi } from './util/api';
import ListProjects from './components/ListProjects/ListProjects';
import ProjectSubmission from './components/ProjectSubmission/ProjectSubmission';
import { loadCurrentProject, getClosestProjects, saveClosestProjects, saveCurrentProject, saveProject } from './util/projectManagement';
import TabsContainer from './components/Tabs/TabsContainer';
import Tab from './components/Tabs/Tab';
import { subsetProjects, combineTexts } from './util/projects';
import WordTimeline from './components/WordTimeline/WordTimeline';
import CooccurrenceMap from './components/CooccurrenceMap/CooccurrenceMap';
import { formatDataForCoOccurrenceMatrix } from './util/charts';


function App() {
    const [activeTab, setActiveTab] = useState("");
    const [wordCloudTabId, setWordCloudTabId] = useState("wordcloud");
    const [timelineTabId, setTimelineTabId] = useState("timeline");
    const [coocTabId, setCoocTabId] = useState("coocmap");

    const [viewWordCloud, setViewWordCloud] = useState(false);
    const [viewWordCloud2, setViewWordCloud2] = useState(false);
    const [curProjectWords, setCurProjectWords] = useState([]);
    const [closestProjectsWords, setClosestProjectsWords] = useState([]);

    const [coocMatrix, setCoocMatrix] = useState(null);


    const [uploadedProjects, setUploadedProjects] = useState(null);
    const [currentProject, setCurrentProject] = useState(null);
    const [topProjectsList, setTopProjectsList] = useState(null);
    const [topProjects, setTopProjects] = useState([]);
    const [topNumber, setTopNumber] = useState(50);

    const wordCloudWrapperStyle = {
        display: "flex",
        flexFlow: "row",
        justifyContent: "space-evenly",
        // backgroundColor: "blue",
        // overflow: "auto",
        maxHeight: "800px",
        width: "100%",
        // minWidth: "100%"
    }

    const activeTabStyle = {
        backgroundImage: "linear-gradient(to top, white, #DCDCDC)",
        boxShadow: "inset 0 0 10px #000000",
    }

    const inActiveTabStyle = {
        backgroundImage: "linear-gradient(to top, #DCDCDC, white)"
    }

    const chooseTabStyle = (tabId) => {
        let tabStyle = {
            width: "200px",
            margin: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            borderRadius: "10px",
            border: "solid",
            borderWidth: "1px",
            textShadow: "1px 1px #ffffff",
        }
        return tabId === activeTab ? Object.assign(tabStyle, activeTabStyle)
            : Object.assign(tabStyle, inActiveTabStyle)
    }

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
    }, [currentProject]);

    const toggleWordCloud = () => {
        setViewWordCloud(!viewWordCloud)
    }
    const toggleWordCloud2 = () => {
        setViewWordCloud2(!viewWordCloud2)
    }

    const findClosest = (project) => {
        return callApi('closestprojects', 'POST', project);
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

    const onClickTab = tabId => {
        setActiveTab(tabId)
    }

    const inputStyle = { width: "50px" }


    const renderWordCloudTab = () => {
        return <div style={wordCloudWrapperStyle}>
            <div style={{ width: "50%" }}>
                <button disabled={!currentProjectExists()} onClick={toggleWordCloud}>Generate word cloud for your project</button>
                {viewWordCloud ? <WordCloudContainer wordsToCompare={closestProjectsWords} setWords={setCurProjectWords} onProjectChange={onProjectChange} projects={[currentProject]} />
                    : null
                }
            </div>
            <div style={{ width: "50%" }}>
                <button disabled={topProjects.length < 1} onClick={toggleWordCloud2}>Generate word cloud for closest projects</button>
                {viewWordCloud2 ? <WordCloudContainer wordsToCompare={curProjectWords} setWords={setClosestProjectsWords} onProjectChange={saveAndSetProject} projects={subsetProjects(topProjects, topNumber)} />
                    : null
                }
            </div>
        </div>
    }

    const renderWordTimelineTab = () => {
        return <WordTimeline projects={subsetProjects(topProjects, topNumber)} />
    }

    const renderCoocMapTab = () => {
        return <CooccurrenceMap projects={subsetProjects(topProjects, topNumber)} />
    }

    return (
        <div className="App">
            <h1>Look up most related projects</h1>
            <ProjectSubmission currentProject={currentProject} onChange={onProjectChange} />
            <hr />
            {
                currentProject
                    ? <div>
                        {
                            topProjects.length > 0
                                ? <ListProjects projects={topProjects} onProjectChange={saveAndSetProject} />
                                : <p>Finding similar projects...</p>
                        }

                        <TabsContainer>
                            <Tab text="Word Cloud" id={wordCloudTabId} onClick={onClickTab} styleFunc={chooseTabStyle} />
                            <Tab text="Word Timeline" id={timelineTabId} onClick={onClickTab} styleFunc={chooseTabStyle} />
                            <Tab text="Co-occurence Map" id={coocTabId} onClick={onClickTab} styleFunc={chooseTabStyle} />
                        </TabsContainer>
                        <hr />
                        < input style={inputStyle} type="number" min={0} max={1000} onChange={onInputChange} value={topNumber} /> closest projects
            {
                            activeTab === wordCloudTabId
                                ? renderWordCloudTab()
                                : null
                        }
                        {
                            activeTab === timelineTabId
                                ? renderWordTimelineTab()
                                : null
                        }
                        {
                            activeTab === coocTabId
                                ? renderCoocMapTab()
                                : null
                        }
                    </div>
                    : null
            }
        </div>
    );
}

export default App;
