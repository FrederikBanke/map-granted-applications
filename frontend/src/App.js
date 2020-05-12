import React, { useState, useEffect } from 'react';
import './App.css';
import WordCloudContainer from './components/WordCloud/WordCloudContainer';
import { callApi, sortWordWeights, formatWordWeightsData } from './util/api';
import ListProjects from './components/ListProjects/ListProjects';
import ProjectSubmission from './components/ProjectSubmission/ProjectSubmission';
import { loadCurrentProject, getClosestProjects, saveClosestProjects, saveCurrentProject, saveProject } from './util/projectManagement';
import TabsContainer from './components/Tabs/TabsContainer';
import Tab from './components/Tabs/Tab';
import { subsetProjects, combineTexts, extractProjectObjectives } from './util/projects';
import WordTimeline from './components/WordTimeline/WordTimeline';
import CooccurrenceMap from './components/CooccurrenceMap/CooccurrenceMap';
import { getTermsFromList } from './util/weights';
import WordTimelineNew, { WordList, WordElement } from './components/WordTimeline/WordTimelineNew';
import ChartContainer from './components/Charts/ChartContainer';
import Chart from 'react-google-charts';
import { formatDataForCharts } from './util/charts';


function App() {
    const [activeTab, setActiveTab] = useState("");
    const [wordCloudTabId,] = useState("wordcloud");
    const [timelineTabId,] = useState("timeline");
    const [coocTabId,] = useState("coocmap");
    const [timelineAllTabId,] = useState("timelineall");

    const [curProjectWordWeights, setCurProjectWordWeights] = useState([]);
    const [simProjectWordWeights, setSimProjectWordWeights] = useState([]);

    const [viewWordCloudSingle, setViewWordCloudSingle] = useState(false);
    const [viewWordCloudClosest, setViewWordCloudClosest] = useState(false);

    const [uploadedProjects, setUploadedProjects] = useState(null);
    const [currentProject, setCurrentProject] = useState(null);
    const [topProjectsList, setTopProjectsList] = useState(null);
    const [topProjects, setTopProjects] = useState([]);
    const [topNumber, setTopNumber] = useState(50);

    const [allWords, setAllWords] = useState([]);
    const [chosenWordsTLAll, setChosenWordsTLAll] = useState(["et ord"]);
    const [weightsByYear, setWeightsByYear] = useState({
        "2010": [
            { "text": "et ord", "value": 3 }
        ]
    });

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

    const inputStyle = { width: "50px" }

    const activeTabStyle = {
        backgroundImage: "linear-gradient(to top, white, #DCDCDC)",
        boxShadow: "inset 0 0 10px #000000",
    }

    const inactiveTabStyle = {
        backgroundImage: "linear-gradient(to top, #DCDCDC, white)"
    }

    /**
     * Chooses a style for a tab button. It checks if the button is for the currently active tab.
     * @param {String} tabId ID of the tab to change style on
     */
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
            : Object.assign(tabStyle, inactiveTabStyle)
    }

    /**
     * Effect for setting the current project on page load. Only runs one time on intial page load.
     */
    useEffect(() => {
        setCurrentProject(loadCurrentProject());
        callApi('wordweightsyear', 'GET')
            .then(res => {
                let newWeightsByYear = {}
                for (const year in res) {
                    if (res.hasOwnProperty(year)) {
                        const weights = res[year];
                        newWeightsByYear[year] = sortWordWeights(formatWordWeightsData(weights))
                    }
                }
                
                setWeightsByYear(newWeightsByYear);
                callApi('getallterms')
                .then(allTermsRaw => {
                    console.log("All terms", allTermsRaw);
                    
                })
            })
    }, []);

    /**
     * Effect for fetching the closest projects to the currently active project.
     * Runs every time the currently active project changes in the state.
     */
    useEffect(() => {
        if (currentProject) {
            getSimilarProjects()
                .then(similarProjects => {
                    callApi('wordweight', 'POST', {
                        "text": extractProjectObjectives(similarProjects.slice(0, topNumber)),
                        // "text": [],
                        "user_project": currentProject
                    })
                        .then(weightDict => {
                            let formattedData = formatWordWeightsData(weightDict);
                            let sortedWordWeights = sortWordWeights(formattedData);

                            setCurProjectWordWeights(sortedWordWeights.slice(0, 50));
                        });
                    callApi('wordweight', 'POST', {
                        "text": extractProjectObjectives(similarProjects.slice(0, topNumber)),
                        "user_project": null
                    })
                        .then(weightDict => {
                            let formattedData = formatWordWeightsData(weightDict);
                            let sortedWordWeights = sortWordWeights(formattedData);

                            setSimProjectWordWeights(sortedWordWeights.slice(0, 50));
                        });
                });
        }
    }, [currentProject]);

    /**
     * Toggle the visibility of the word cloud for the currently selected project.
     */
    const toggleWordCloudSingle = () => {
        setViewWordCloudSingle(!viewWordCloudSingle)
    }
    /**
     * Toggle the visibility of the word cloud for the closest projects.
     */
    const toggleWordCloudClosest = () => {
        setViewWordCloudClosest(!viewWordCloudClosest)
    }

    /**
     * Calls the backend API for the most similar projects.
     * @param {Object} project The project to find similar abstracts to
     * @returns {Promise} A `Promise` where the resolved value is the extracted JSON from the API response.
     */
    const findClosest = (project) => {
        return callApi('closestprojects', 'POST', project);
    }

    /**
     * Sets word cloud of closest projects visibility to `false`. Sets `topNumber` in state to the new value entered into the input.
     * @param {Event} event The DOM event that is triggered when input changes
     */
    const onInputChange = event => {
        setViewWordCloudClosest(false);
        let value = parseInt(event.target.value);
        if (isNaN(value)) {
            value = 0;
        }
        // TODO: Make it so if a number over 1000 is entered, it will automatically be reduced to 1000.
        if (0 <= value && value <= 1000) {
            setTopNumber(value);
        }
    }

    /**
     * Checks if there is a project currently active. Returns `true` if there is and `false` otherwise.
     * @returns {boolean}
     */
    const currentProjectExists = () => {
        if (currentProject) {
            return true;
        }
        return false;
    }

    /**
     * Saves a project to the browser's local state. After the project is saved it runs the @function onProjectChange function. 
     * @param {Object} project The project to save and set active
     */
    const saveAndSetProject = project => {
        if (project) {
            saveProject(project);
        }
        onProjectChange(project);
    }

    /**
     * Get similar projects to user project.
     * Will load from browser's local storage if they exist.
     * Will fetch new ones if there is nothing in loca storage.
     * @returns {[Object]} A list of projects
     */
    const getSimilarProjects = () => {
        let closestProjects = getClosestProjects();
        if (closestProjects) {
            setTopProjects(closestProjects);
            return Promise.resolve(closestProjects);
        }
        else {
            console.group("GetClosestProjects");
            console.info("Calling backend for closest projects!");
            console.time("FindNewClosestProjects");
            return findClosest(currentProject)
                .then(newClosestProjects => {
                    saveClosestProjects(newClosestProjects);
                    setTopProjects(newClosestProjects);
                    console.timeEnd("FindNewClosestProjects");
                    console.groupEnd();
                    return newClosestProjects;
                });
        }
    }
    /**
     * A handler for running other functions when the currently active project changes. It sets the project as the current project in state.
     * @param {Object} project The project that is being changed to
     */
    const onProjectChange = project => {
        setViewWordCloudSingle(false);
        setViewWordCloudClosest(false);
        if (project) {
            if (currentProject) {
                // Only runs if changing to a new project (based on project id)
                if (project.id !== currentProject.id) {
                    localStorage.removeItem('closestProjects');
                    saveCurrentProject(project);
                    setTopProjects([]); // cleans the list view while fetching for new closest projects
                    setCurrentProject(project);
                }
            } else {
                // FIXME: Repeated code
                localStorage.removeItem('closestProjects');
                saveCurrentProject(project);
                setTopProjects([]);
                setCurrentProject(project);
            }
        } else {
            // If the project is null: delete data saved in local storage and in state
            localStorage.removeItem('closestProjects');
            localStorage.removeItem('currentProject');
            setCurrentProject(null);
            setTopProjects([]);
        }
    }

    /**
     * When check box is changed add or remove word from chosen words list.
     * @param {Event} event DOM event
     */
    const onClickCheckBox = (event) => {
        const isChecked = event.target.checked;
        const word = event.target.getAttribute("name");
        console.log(word, "is checked:", isChecked);

        let newChosenWords = [...chosenWordsTLAll];

        if (isChecked) {
            newChosenWords.push(word);
        } else {
            const wordIndex = newChosenWords.indexOf(word);
            newChosenWords.splice(wordIndex, 1);
        }
        console.log("New chosen words", newChosenWords);

        setChosenWordsTLAll(newChosenWords);
    }

    /**
     * Handler for changing tab.
     * @param {String} tabId ID of the tab to change to
     */
    const onClickTab = tabId => {
        setActiveTab(tabId)
    }

    const compClouds = () => {
        return viewWordCloudSingle && viewWordCloudClosest;
    }

    const renderWordCloudTab = () => {
        return <div style={wordCloudWrapperStyle}>
            <div style={{ width: "50%" }}>
                <button disabled={!currentProjectExists()} onClick={toggleWordCloudSingle}>Generate word cloud for your project</button>
                {viewWordCloudSingle ? <WordCloudContainer
                    userProject={currentProject}
                    onProjectChange={onProjectChange}
                    projects={[currentProject]}
                    words={curProjectWordWeights}
                    wordsToCompare={simProjectWordWeights}
                    compare={compClouds()}
                />
                    : null
                }
            </div>
            <div style={{ width: "50%" }}>
                <button disabled={topProjects.length < 1} onClick={toggleWordCloudClosest}>Generate word cloud for closest projects</button>
                {viewWordCloudClosest ? <WordCloudContainer
                    onProjectChange={saveAndSetProject}
                    projects={subsetProjects(topProjects, topNumber)}
                    words={simProjectWordWeights}
                    wordsToCompare={curProjectWordWeights}
                    compare={compClouds()}
                />
                    : null
                }
            </div>
        </div>
    }

    const renderWordTimelineTab = () => {
        return <WordTimeline projects={subsetProjects(topProjects, topNumber)} />
    }

    const renderWordTimelineAllTab = () => {
        return <WordTimelineNew >
            <WordList>
                {
                    allWords.map(word => (
                        <WordElement
                            key={word.text}
                            text={word.text}
                            isChecked={chosenWordsTLAll.includes(word.text)}
                            onClickCheckBox={onClickCheckBox}
                        />
                    ))
                }
            </WordList>
            <ChartContainer>
                {renderChart(formatDataForCharts(weightsByYear, chosenWordsTLAll), "ColumnChart")}
                {renderChart(formatDataForCharts(weightsByYear, chosenWordsTLAll), "LineChart")}
            </ChartContainer>
        </WordTimelineNew>
    }

    const renderCoocMapTab = () => {
        return <CooccurrenceMap
            projects={subsetProjects(topProjects, topNumber)}
            wordsToColor={getTermsFromList(curProjectWordWeights)}
            wordWeights={simProjectWordWeights}
        />
    }

    /**
    * 
    * @param {*} data
    * @param {string} chartType
    */
    const renderChart = (data, chartType) => {
        return (
            <Chart
                width="100%"
                height={400}
                chartType={chartType}
                loader={<div>Loading Chart</div>}
                data={data}
                options={{
                    title: 'Word importance by year',
                    chartArea: { width: '70%', height: "70%" },
                    hAxis: {
                        title: 'Year',
                        // minValue: 0,
                    },
                    vAxis: {
                        title: 'Word score',
                        minValue: 0,
                    },
                }}
            // legendToggle
            />
        )
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
                            <Tab text="Word Timeline All" id={timelineAllTabId} onClick={onClickTab} styleFunc={chooseTabStyle} />
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
                        {
                            activeTab === timelineAllTabId
                                ? renderWordTimelineAllTab()
                                : null
                        }
                    </div>
                    : null
            }
        </div>
    );

}

export default App;
