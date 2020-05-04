import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { combineTexts, groupProjectsByYear } from '../../util/projects';
import { callApi, formatData, subsetWords } from '../../util/api';
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


    useEffect(() => {
        if (props.projects.length > 0) {
            let projectsByYear = groupProjectsByYear(props.projects);

            let weightsByYearResponse = {};

            let apiPromises = [];

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

            Promise.all(apiPromises)
                .then(() => {
                    setWeightsByYear(weightsByYearResponse);
                    getWordWeight(props.projects)
                        .then(weights => {
                            let sorted = subsetWords(weights);

                            setAllWords(sorted);

                            let words = [];
                            let subset = subsetWords(weights, 5);
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

    const getWordWeight = (projects) => {
        return callApi('wordweight', 'POST', {
            "text": combineTexts(projects),
            "user_project": props.userProject || null
        })
            .then(res => {
                let formattedData = formatData(res);
                return formattedData;
            });
    }

    const renderBarChart = props => {
        return (
            <Chart
                width="100%"
                height={400}
                chartType="ColumnChart"
                loader={<div>Loading Chart</div>}
                data={props.data}
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
                legendToggle
            />
        )
    }

    const renderLineChart = props => {
        return <Chart
            width="100%"
            height={400}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={props.data}
            options={{
                hAxis: {
                    title: 'Year',
                },
                vAxis: {
                    title: 'Word score',
                },
            }}
        // rootProps={{ 'data-testid': '1' }}
        />
    }

    const onClickCheckBox = (event) => {
        const isChecked = event.target.checked;
        const word = event.target.getAttribute("name");
        console.log(word, isChecked);

        let tempWords = [...chosenWords];

        if (isChecked) {
            tempWords.push(word);
        } else {
            const wordIndex = tempWords.indexOf(word);
            tempWords.splice(wordIndex, 1);
        }

        setChosenWords(tempWords);
    }


    const renderWordList = props => (
        <div style={listStyle}>
            {
                props.words.map(word => (
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
                                    {renderBarChart({ "data": formatDataForCharts(weightsByYear, chosenWords) })}
                                    {renderLineChart({ "data": formatDataForCharts(weightsByYear, chosenWords) })}
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
