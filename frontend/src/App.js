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
import Autosuggest from 'react-autosuggest';


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
    const [inputNumber, setInputNumber] = useState(50);

    const [allWords, setAllWords] = useState([]);
    const [chosenWordsTL, setChosenWordsTL] = useState([]);
    const [activeWordsTL, setActiveWordsTL] = useState([]);
    const [weightsByYear, setWeightsByYear] = useState({});

    const [suggestionValue, setSuggestionValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

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
        callApi('getallterms')
        .then(allTerms => {
            setAllWords(allTerms)
        });
    }, []);

    /**
     * Effect for fetching the closest projects to the currently active project.
     * Runs every time the currently active project changes in the state.
     */
    useEffect(() => {
        if (currentProjectExists()) {
            getSimilarProjects()
                .then(similarProjects => {
                    callApi('wordweight', 'POST', {
                        "text": extractProjectObjectives([currentProject]),
                        "user_project": null,
                        "refit": true
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
                            setChosenWordsTL([...chosenWordsTL, ...getTermsFromList(sortedWordWeights.slice(0, 50))]);
                            setActiveWordsTL([...activeWordsTL, ...getTermsFromList(sortedWordWeights.slice(0, 5))]);
                            getScoresForTerms(getTermsFromList(sortedWordWeights.slice(0, 50)))
                            .then(scoresFor50 => {
                                setWeightsByYear(scoresFor50);
                            });
                        });
                });
        }
    }, [currentProject, topNumber]);

    const getScoresForTerms = terms => {
        return callApi('termscoreyear', 'POST', {
            "words": terms
        })
            .then(res => {
                console.log("Scores for terms", res);

                let newWeightsByYear = {}
                for (const year in res) {
                    if (res.hasOwnProperty(year)) {
                        newWeightsByYear[year] = sortWordWeights(res[year])
                    }
                }

                return newWeightsByYear;
            })
    }

    const addNewTermYearScores = (termScores) => {
        
        let oldScores = { ...weightsByYear };
        console.log("Old terms", oldScores);
        let newScores = {}
        for (const year in oldScores) {
            if (oldScores.hasOwnProperty(year)) {
                const yearWeights = oldScores[year];
                const newYearScores = termScores[year];
                yearWeights.push(...newYearScores);
                newScores[year] = yearWeights;
            }
        }

        console.log("New terms", newScores);

        setWeightsByYear(newScores);
    }

    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0
            ? []
            : allWords.filter(word => word.toLowerCase().slice(0, inputLength) === inputValue)
    }

    const getSuggestionValue = suggestion => suggestion;

    const renderSuggestion = suggestion => (
        <span>{suggestion}</span>
    )

    const shouldRenderSuggestion = suggestion => (
        suggestion.trim().length > 2 // only render when more than 2 characters entered
    )

    const onChangeSearch = (event, { newValue }) => {
        setSuggestionValue(newValue);
    }

    const onSuggestionFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value).slice(0, 10)); // only show 10 suggestions
    }

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    }

    const onWordClickSearch = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
        let newChosen = [suggestionValue, ...chosenWordsTL];
        setChosenWordsTL(newChosen);
        let newActive = [suggestionValue, ...activeWordsTL];
        setActiveWordsTL(newActive);

        getScoresForTerms(suggestionValue)
        .then(scores => {
            addNewTermYearScores(scores);
        })
            
    }

    const onClickSetN = () => {
        setSimProjectWordWeights([]);
        setCurProjectWordWeights([]);
        setTopNumber(inputNumber);
    }

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
        let value = parseInt(event.target.value);
        if (isNaN(value)) {
            value = 0;
        }
        // TODO: Make it so if a number over 1000 is entered, it will automatically be reduced to 1000.
        if (0 <= value && value <= 1000) {
            setInputNumber(value);
        } else {
            setInputNumber(1000);
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
    const onClickCheckBoxSim = (event) => {
        const isChecked = event.target.checked;
        const word = event.target.getAttribute("name");

        let newActiveWords = [...activeWordsTL];

        if (isChecked) {
            newActiveWords.push(word);
        } else {
            const wordIndex = newActiveWords.indexOf(word);
            newActiveWords.splice(wordIndex, 1);
        }

        setActiveWordsTL(newActiveWords);
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
        // return <WordTimeline projects={subsetProjects(topProjects, topNumber)} />
        return <WordTimelineNew >
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                onSuggestionSelected={onWordClickSearch}
                renderSuggestion={renderSuggestion}
                shouldRenderSuggestions={shouldRenderSuggestion}
                inputProps={{
                    placeholder: "Enter search term",
                    value: suggestionValue,
                    onChange: onChangeSearch,
                }}
            />
            <br />
            <WordList>
                {
                    chosenWordsTL.map(word => (
                        <WordElement
                            key={word}
                            text={word}
                            isChecked={activeWordsTL.includes(word)}
                            onClickCheckBox={onClickCheckBoxSim}
                        />
                    ))
                }
            </WordList>
            <ChartContainer>
                {renderChart(formatDataForCharts(weightsByYear, activeWordsTL), "ColumnChart")}
                {renderChart(formatDataForCharts(weightsByYear, activeWordsTL), "LineChart")}
            </ChartContainer>
            <p>Note: A score of 0 does not mean a word was never used.</p>
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
            data[0].length > 1 ?
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
                : null
        )
    }

    return (
        <div className="App">
            <h1>Look up most related projects</h1>
            <ProjectSubmission currentProject={currentProject} onChange={onProjectChange} />
            <hr />
            <div>
                {currentProject ?
                    topProjects.length > 0
                        ? <ListProjects projects={topProjects} onProjectChange={saveAndSetProject} />
                        : <p>Finding similar projects...</p>
                    : null
                }

                <TabsContainer>
                    <Tab text="Word Cloud" id={wordCloudTabId} onClick={onClickTab} styleFunc={chooseTabStyle} isEnabled={currentProjectExists()} />
                    <Tab text="Word Timeline" id={timelineTabId} onClick={onClickTab} styleFunc={chooseTabStyle} isEnabled={true} />
                    <Tab text="Co-occurence Map" id={coocTabId} onClick={onClickTab} styleFunc={chooseTabStyle} isEnabled={currentProjectExists()} />
                </TabsContainer>
                <hr />
                < input style={inputStyle} type="number" min={0} max={1000} onChange={onInputChange} value={inputNumber} /> closest projects
                        <button onClick={onClickSetN}>Click to set new 'n'</button>
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
        </div>
    );

}

export default App;
