import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Graph from "react-graph-network";
import { callApi, formatWordWeightsData, sortWordWeights, scaleWordWeights } from '../../util/api';
import { formatDataForCoOccurrenceMatrix } from '../../util/charts';
import { subsetProjects, combineTexts, extractProjectObjectives } from '../../util/projects';

const CooccurrenceMap = props => {
    const [matrixData, setMatrixData] = useState(null);
    const [maxWeight, setMaxWeight] = useState(null);
    const [minWeight, setMinWeight] = useState(null);

    const containerStyle = {
        width: "100%",
        height: "600px",
        backgroundColor: "#a1a1a1"
    }

    const tempData = {
        nodes: [
            { id: "innovation", weight: 20, colorClass: 0 },
            { id: "nano", weight: 10, colorClass: 0 },
            { id: "neuron", weight: 16, colorClass: 1 },
            { id: "neuronal", weight: 6, colorClass: 1 },
            { id: "synapse", weight: 12, colorClass: 2 },
            { id: "smes", weight: 7, colorClass: 3 },
        ],
        links: [
            { "source": "innovation", "target": "nano", weight: 2 },
            { "source": "innovation", "target": "synapse", weight: 4 },
            { "source": "nano", "target": "neuronal", weight: 4 },
            { "source": "nano", "target": "neuron", weight: 2 },
            { "source": "nano", "target": "synapse", weight: 2 },
            { "source": "smes", "target": "synapse", weight: 2 },
        ]
    };

    useEffect(() => {
        console.log("mount CoocMap");

        callApi('filterobjectives', 'POST', {
            texts: extractProjectObjectives(props.projects),
            // weight_dict: {}
        })
            .then(res => {
                callApi('cooccurrencematrix', 'POST', {
                    "texts": res.filteredObjectives,
                })
                    .then((vocabAndMatrix) => {
                        let formattedWeightsData = formatWordWeightsData(res.wordWeights);
                        let weights = sortWordWeights(formattedWeightsData);

                        // console.log("weights before", weights);
                        weights = scaleWordWeights(weights, 1000);
                        let normWeights = sizeNormalizer(weights);
                        // console.log("weights after", normWeights);

                        const threshold = 0.03;

                        let formattedMatrixData = formatDataForCoOccurrenceMatrix(vocabAndMatrix.vocabulary, normWeights, vocabAndMatrix.coOccurrenceMatrix, threshold);
                        console.log("setMatrixData");
                        console.log("Vocabulary", vocabAndMatrix.vocabulary.length);
                        console.log("word weights", normWeights.length);

                        formattedMatrixData.links.forEach(element => {
                            if (element.source.id === "at") {
                                console.log(element);
                                
                            }
                        });
                        
                        
                        setMatrixData(formattedMatrixData);
                    });
            });

    }, [props.projects]);

    const getWordWeights = (projects, userProject = null) => {
        return callApi('wordweight', 'POST', {
            "text": combineTexts(projects),
            // "text": ["Test project", "andet project med flere ord"].join(" "),
            "user_project": userProject
        })
            .then(res => {
                let formattedData = formatWordWeightsData(res);
                let sorted = sortWordWeights(formattedData);

                // setClosestProjectsWords(subset);
                return sorted;
            });
    }

    const getColor = colorClass => {
        const colors = [
            ["yellow", "lightyellow"],
            ["blue", "lightblue"],
            ["green", "lightgreen"],
            ["green", "lightgreen"],
            ["green", "lightgreen"],
            ["green", "lightgreen"],
        ];

        return colors[colorClass];
    }

    const Line = ({ link, ...restProps }) => {
        // console.log(data.nodes);

        const sourceNode = matrixData.nodes.find((value) => {
            // console.log(`${link.source}`);

            return value.id === link.source;
        });

        if (sourceNode === undefined) {
            console.log("Could not find node with id", link.source);
            
            throw new Error(`Could not find node with id: ${link.source}`)
        }

        const color = getColor(sourceNode.colorClass)[1];
        return (
            <line
                {...restProps}
                stroke={color}
                strokeWidth={link.weight}
            />
        )
    };

    const fontSize = 14;

    const Node = ({ node }) => {
        // colors
        // const familyMatch = node.family.match(/Tolst|Trubetsk|Volkonsk|Gorchakov/);
        // const stroke = colorSwitch(familyMatch);
        const [fillColor, strokeColor] = getColor(node.colorClass);


        // sizes
        const sizes = {
            radius: node.weight,
            textSize: fontSize,
            textX: 0,
            textY: 0,
        };


        return (
            <>
                <circle
                    fill={fillColor}
                    stroke={strokeColor}
                    r={sizes.radius}
                />
                <g style={{ fontSize: sizes.textSize + 'px' }}>
                    <text
                        x={sizes.textX}
                        y={sizes.textY}
                    >
                        {node.id}
                    </text>
                </g>

            </>
        );
    };

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
        const minLimit = 3;
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


    return (
        <div style={containerStyle}>
            {console.log("coocmap render")}
            {
                matrixData ? <Graph
                    data={matrixData}
                    NodeComponent={Node}
                    LineComponent={Line}
                    nodeDistance={700}
                    zoomDepth={3}
                    hoverOpacity={0.3}
                    enableDrag={true}
                    pullIn={true}
                />
                    : null
            }

        </div>
    )
}

CooccurrenceMap.propTypes = {
    projects: PropTypes.array,
}

export default CooccurrenceMap
