import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Graph from "react-graph-network";
import { callApi, formatData, subsetWords } from '../../util/api';
import { formatDataForCoOccurrenceMatrix } from '../../util/charts';
import { subsetProjects, combineTexts, extractProjectObjectives } from '../../util/projects';

const CooccurrenceMap = props => {
    const [data, setData] = useState(null);
    const [maxWeight, setMaxWeight] = useState(null);
    const [minWeight, setMinWeight] = useState(null);

    const containerStyle = {
        width: "100%",
        height: "600px",
        backgroundColor: "#a1a1a1"
    }

    useEffect(() => {
        console.log("renderCoocMap");

        callApi('cooccurrencematrix', 'POST', {
            "texts": extractProjectObjectives(props.projects),
        })
            .then((res) => {
                getWordWeights(props.projects).then(weights => {
                    // console.log("weights before", weights);
                    let normWeights = sizeNormalizer(weights);
                    // console.log("weights after", normWeights);
                    
                    let formattedData = formatDataForCoOccurrenceMatrix(res.vocabulary, normWeights, res.coOccurrenceMatrix);
                    setData(formattedData);
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
                let formattedData = formatData(res);
                let subset = subsetWords(formattedData);

                // setClosestProjectsWords(subset);
                return subset;
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
            { "source": "nano", "target": "neuronal", weight: 8 },
            { "source": "nano", "target": "neuron", weight: 2 },
            { "source": "nano", "target": "synapse", weight: 2 },
            { "source": "smes", "target": "synapse", weight: 2 },
        ]
    };



    const Line = ({ link, ...restProps }) => {
        // console.log(data.nodes);

        const sourceNode = data.nodes.find((value) => {
            // console.log(`${link.source}`);

            return value.id === link.source;
        });

        if (sourceNode === undefined) {
            return (
                <line
                    {...restProps}
                    stroke={"#fff000"}
                    strokeWidth={link.weight * 100}
                />
            )
        }

        const color = getColor(sourceNode.colorClass)[1];
        return (
            <line
                {...restProps}
                stroke={color}
                strokeWidth={link.weight * 3}
            />
        )
    };

    const fontSize = 14;
    const radius = 10;

    const Node = ({ node }) => {
        // colors
        // const familyMatch = node.family.match(/Tolst|Trubetsk|Volkonsk|Gorchakov/);
        // const stroke = colorSwitch(familyMatch);
        const [fillColor, strokeColor] = getColor(node.colorClass)


        // sizes
        const sizes = {
            radius: node.weight,
            textSize: fontSize,
            textX: radius * 1.5,
            textY: radius / 2,
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
                        x={sizes.radius + 7}
                        y={sizes.radius / 2}
                    >
                        {node.id}
                    </text>
                </g>

            </>
        );
    };

    const findMax = (data) => {
        let max = { text: null, value: 0 }
        data.forEach(word => {
            if (word.value > max.value) {
                max = word;
            }
        });
        return max;
    }

    const findMin = (data) => {
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

        const maxLimit = 20; // 143 is max for 800x800 canvas
        const minLimit = 1;
        const max = findMax(weights).value;
        const min = findMin(weights).value;

        weights.forEach(word => {
            let normWeight = (maxLimit - minLimit) / (max - min) * (word.value - max) + maxLimit;
            
            normalizedWeights.push({
                text: word.text,
                value: normWeight
            })
        });

        return normalizedWeights;
    }


    return (
        <div style={containerStyle}>
            {
                data ? <Graph
                    data={data}
                    NodeComponent={Node}
                    LineComponent={Line}
                    nodeDistance={300}
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
