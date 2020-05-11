import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { combineTexts, groupProjectsByYear, extractProjectObjectives } from '../../util/projects';
import { callApi, formatWordWeightsData, sortWordWeights, subsetWords } from '../../util/api';
import { Chart } from "react-google-charts";
import { formatDataForCharts } from '../../util/charts';

/**
 * 
 * @param {Object} props 
 * @param {[]} props.projects
 */
const WordTimeline = props => {
    const [weightsByYear, setWeightsByYear] = useState({});
    const [allWords, setAllWords] = useState([]);
    const [chosenWords, setChosenWords] = useState([]);

    const containerStyle = {
        display: "flex",
        width: "100%",
        height: "10%",
        flexFlow: "row"
    }

    const listStyle = {
        textAlign: "left",
        height: "100%",
        maxHeight: "800px",
        width: "200px",
        overflowY: "auto"
    }
    const chartContainerStyle = {
        display: "flex",
        width: "100%",
        height: "fit-content",
        maxHeight: "100%",
        flexFlow: "column"
    }

    /**
     * Groups projects by year and fetches word weights for each year. Runs every time props.projects changes.
     */
    useEffect(() => {
        if (props.projects.length > 0) {
            let projectsByYear = groupProjectsByYear(props.projects);

            let weightsByYearResponse = {};

            let apiPromises = [];

            // Fetch word weights for projects for each year and make promise for each one
            for (const year in projectsByYear) {
                if (projectsByYear.hasOwnProperty(year)) {
                    const projects = projectsByYear[year];
                    apiPromises.push(
                        getWordWeight(projects)
                            .then(weights => {
                                weightsByYearResponse[year] = weights;
                            })
                    );
                }
            }

            // When all weights have been gathered run this code
            Promise.all(apiPromises)
                .then(() => {
                    setWeightsByYear(weightsByYearResponse);
                    getWordWeight(props.projects)
                        .then(weights => {
                            let sorted = sortWordWeights(weights);

                            setAllWords(sorted);

                            // Set the top 5 words to be the chosen words by default
                            let words = [];
                            let subset = subsetWords(sorted, 5);
                            for (const key in subset) {
                                if (subset.hasOwnProperty(key)) {
                                    const element = subset[key];
                                    words.push(element.text)
                                }
                            }

                            setChosenWords(words)
                        });
                });

        }
    }, [props.projects]);

    /**
     * Gets word weights based on the given projects and returns the formatted data.
     * @param {[Objects]} projects List of projects
     * @returns {Promise} The resolved value is the word weights formatted.
     */
    const getWordWeight = (projects) => {
        return callApi('wordweight', 'POST', {
            "text": extractProjectObjectives(projects),
            "user_project": props.userProject || null
        })
            .then(res => {
                let formattedData = formatWordWeightsData(res);
                return formattedData;
            });
    }

    /**
     * 
     * @param {*} param0 
     */
    const renderChart = ({ data, chartType }) => {
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

    /**
     * When check box is changed add or remove word from chosen words list.
     * @param {Event} event DOM event
     */
    const onClickCheckBox = (event) => {
        const isChecked = event.target.checked;
        const word = event.target.getAttribute("name");

        let newChosenWords = [...chosenWords];

        if (isChecked) {
            newChosenWords.push(word);
        } else {
            const wordIndex = newChosenWords.indexOf(word);
            newChosenWords.splice(wordIndex, 1);
        }

        setChosenWords(newChosenWords);
    }


    const renderWordList = props => (
        <div style={listStyle}>
            {
                props.words.slice(0,50).map(word => (
                    <React.Fragment key={word.text}>
                        <input onClick={onClickCheckBox} type="checkbox" name={word.text} value={word.text} checked={chosenWords.includes(word.text)} />
                        <label for={word.text}>{word.text}</label><br />
                    </React.Fragment>
                ))
            }
        </div>
    )




    return (
        <div style={{ width: "100%", height: "100%" }}>
            <h2>Word Timeline</h2>
            <div style={containerStyle}>
                {renderWordList({ "words": allWords })}
                <div style={chartContainerStyle}>
                    {
                        chosenWords.length > 0
                            ? <React.Fragment>
                                {renderChart({ "data": formatDataForCharts(weightsByYear, chosenWords), chartType: "ColumnChart" })}
                                {renderChart({ "data": formatDataForCharts(weightsByYear, chosenWords), chartType: "LineChart" })}
                            </React.Fragment>
                            : null
                    }
                </div>
            </div>
        </div >
    )
}

WordTimeline.propTypes = {
    projects: PropTypes.arrayOf(Object).isRequired
}

export default WordTimeline;
