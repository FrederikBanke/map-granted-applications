import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
// import Graph from "react-graph-network";
import Graph from "react-graph-vis";
import { callApi, formatWordWeightsData, sortWordWeights, scaleWordWeights } from '../../util/api';
import { formatDataForCoOccurrenceMatrix, findMaxValue, findMinValue } from '../../util/charts';
import { subsetProjects, combineTexts, extractProjectObjectives } from '../../util/projects';
import { getTermsFromList } from '../../util/weights';
import { getQuaternaryColor, getQuinaryColor, getPrimaryColor, getSecondaryColor, getTertiaryColor, getVisualPrimaryColor, getVisualSecondaryColor, getVisualPrimaryColorLight, getVisualSecondaryColorLight, getVisualQuaternaryColor, getVisualQuaternaryColorLight } from '../../util/colors';
import ReactTooltip from 'react-tooltip';

const CooccurrenceMap = props => {
    const [matrixData, setMatrixData] = useState(null);
    const [maxWeight, setMaxWeight] = useState(null);
    const [minWeight, setMinWeight] = useState(null);
    const [threshold, setThreshold] = useState(50);
    const [inputNumber, setInputNumber] = useState(50);
    const [graphOptions, setGraphOptions] = useState({
        layout: {
            hierarchical: false
        },
        physics: {
            enabled: true,
            solver: "barnesHut",
            barnesHut: {
                // springLength: 10,
                avoidOverlap: 0.5
            },
            forceAtlas2Based: {
                avoidOverlap: 0.5
            },
            minVelocity: 0.3
        },
        edges: {
            color: {
                inherit: 'both',
                opacity: 0.7
            },
            smooth: {
                enabled: true,
                type: 'dynamic'
            },
            physics: true,
            arrows: {
                to: {
                    enabled: false
                }
            }
        },
        nodes: {
            font: {
                color: "#ffffff"
            },
            scaling: {
                label: {
                    enabled: false,
                    drawThreshold: 1
                }
            },
            shape: 'box',
            // mass: 5
        }
    });

    const containerStyle = {
        width: "100%",
        height: "fit-content",
        // backgroundColor: "#a1a1a1"
    }


    /**
     * When projects changes, filter objectives such that words that are not important are removed. 
     */
    useEffect(() => {
        if (props.wordWeights.length > 0) {
            callApi('cooccurrencematrix', 'POST', {
                // "texts": res.filteredObjectives,
                "texts": props.objectives,
                "vocabulary": getTermsFromList(props.wordWeights)
            })
                .then((vocabAndMatrix) => {
                    let scaledWeights = scaleWordWeights(props.wordWeights, 1000);
                    let normWeights = sizeNormalizer(scaledWeights);

                    let formattedMatrixData = formatDataForCoOccurrenceMatrix(
                        vocabAndMatrix.vocabulary, normWeights,
                        vocabAndMatrix.coOccurrenceMatrix, threshold / 1000,
                        props.wordsToColor
                    );

                    setMatrixData(formattedMatrixData);
                });
            // });

        }
        return () => {
            setMatrixData(null);
        }
    }, [props.wordWeights, threshold]);

    const getColor = colorClass => {
        const colors = [
            [getVisualSecondaryColor(), getVisualSecondaryColorLight()],
            [getVisualQuaternaryColor(), getVisualQuaternaryColorLight()],
        ];

        return colors[colorClass];
    }

    const findMaxWord = (data) => {
        let max = { text: null, value: 0 }
        data.forEach(word => {
            if (word.value > max.value) {
                max = word;
            }
        });
        return max;
    }

    const findMinWord = (data) => {
        let min = { text: null, value: 0 }
        data.forEach(word => {
            if (word.value < min.value) {
                min = word;
            }
        });
        return min;
    }

    const sizeNormalizer = weights => {
        let normalizedWeights = [];

        const maxLimit = 30;
        const minLimit = 1;
        const max = findMaxWord(weights).value;
        const min = findMinWord(weights).value;

        weights.forEach(word => {
            let normWeight = (maxLimit - minLimit) / (max - min) * (word.value - max) + maxLimit;

            normalizedWeights.push({
                text: word.text,
                value: normWeight
            });
        });

        return normalizedWeights;
    }

    const options = {
        layout: {
            hierarchical: false
        },
        physics: {
            enabled: true,
            solver: "forceAtlas2Based",
            barnesHut: {
                // springLength: 10,
                avoidOverlap: 0.8
            },
            forceAtlas2Based: {
                avoidOverlap: 0.8
            }
        },
        edges: {
            color: {
                inherit: 'both',
                opacity: 0.7
            },
            smooth: {
                enabled: true,
                type: 'dynamic'
            },
            physics: true,
            arrows: {
                to: {
                    enabled: false
                }
            }
        },
        nodes: {
            font: {
                color: "#ffffff"
            },
            scaling: {
                label: {
                    enabled: false,
                    drawThreshold: 1
                }
            },
            shape: 'box',
            // mass: 5
        }
    }


    const onInputChange = event => {
        let value = parseInt(event.target.value);
        if (isNaN(value)) {
            value = 1;
        }
        // TODO: Make it so if a number over 1000 is entered, it will automatically be reduced to 1000.
        if (1 <= value && value <= 100) {
            setInputNumber(value);
        } else {
            setInputNumber(100);
        }
    }

    const onClickSetThreshold = () => {
        setMatrixData(null);
        setThreshold(inputNumber);
    }

    const events = {
        select: event => {
            let { nodes, edges } = event;
            console.log("Selected nodes:", nodes);
            console.log("Selected edges:", edges);
        }
    }

    const graphStyle = {
        height: "640px"
    }

    return (
        <div style={containerStyle}>
            <br />
            <input style={{ width: "40px" }} type="number" min={1} max={100} onChange={onInputChange} defaultValue={threshold} />
            <span>Threshold</span>
            <span style={{ fontSize: "13px" }} data-tip="A higher threshold means a higher co-occurrence value is needed to establish an edge between nodes (1-100)."> ❔</span>
            <ReactTooltip place="right" effect="solid" multiline="true" />
            <br />
            <button onClick={onClickSetThreshold}>Submit</button>
            <div style={{ height: "640px" }}>
                {
                    matrixData ? <Graph
                        graph={matrixData}
                        options={graphOptions}
                        events={events}
                        style={graphStyle}
                    />
                        : null
                }
            </div>
            <p>The <span style={{ color: getVisualPrimaryColor() }}>blue</span> colored nodes are the words that are important for the active project.</p>
            <p>Edge thickness signifies how often two terms (nodes) co-occur.</p>
            <p>Node size means nothing.</p>
            <p>Edge length means nothing</p>
        </div>
    )
}

CooccurrenceMap.propTypes = {
    projects: PropTypes.array,
    wordsToColor: PropTypes.array,
    wordWeights: PropTypes.arrayOf(Object),
    objectives: PropTypes.arrayOf(String)
}

export default CooccurrenceMap
