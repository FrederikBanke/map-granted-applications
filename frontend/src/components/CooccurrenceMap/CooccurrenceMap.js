import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Graph from "react-graph-network";
import { callApi, formatWordWeightsData, sortWordWeights, scaleWordWeights } from '../../util/api';
import { formatDataForCoOccurrenceMatrix } from '../../util/charts';
import { subsetProjects, combineTexts, extractProjectObjectives } from '../../util/projects';
import { getTermsFromList } from '../../util/weights';

const CooccurrenceMap = props => {
    const [matrixData, setMatrixData] = useState(null);
    const [maxWeight, setMaxWeight] = useState(null);
    const [minWeight, setMinWeight] = useState(null);

    const containerStyle = {
        width: "100%",
        height: "1000px",
        backgroundColor: "#a1a1a1"
    }

    /**
     * When projects changes, filter objectives such that words that are not important are removed. 
     */
    useEffect(() => {
        callApi('filterobjectives', 'POST', {
            texts: extractProjectObjectives(props.projects),
            // weight_dict: {}
        })
            .then(res => {
                let formattedWeightsData = formatWordWeightsData(res.wordWeights);
                let weights = sortWordWeights(formattedWeightsData);
                let subsetWeights = weights.slice(0, 50);
                callApi('cooccurrencematrix', 'POST', {
                    "texts": res.filteredObjectives,
                    "vocabulary": getTermsFromList(subsetWeights)
                })
                    .then((vocabAndMatrix) => {
                        let scaledWeights = scaleWordWeights(subsetWeights, 1000);
                        let normWeights = sizeNormalizer(scaledWeights);
                        console.log(normWeights);
                        console.log(vocabAndMatrix.vocabulary);
                        
                        
                        const threshold = 0.001;
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
            ["#FFE800", "#FFF26E"], // yellow
            ["#0098FF", "#61BFFF"], // blue
            ["#00FF46", "#33FF6B"], // green
            ["green", "lightgreen"], // 
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
            throw new Error(`Could not find node with id: ${link.source}`)
        }

        const color = getColor(sourceNode.colorClass)[1] + "10";
        return (
            <line
                {...restProps}
                stroke={color}
                strokeWidth={link.weight}
            />
        )
    };

    const fontSize = 12;

    const Node = ({ node }) => {
        // colors
        // const familyMatch = node.family.match(/Tolst|Trubetsk|Volkonsk|Gorchakov/);
        // const stroke = colorSwitch(familyMatch);
        const [fillColor, strokeColor] = getColor(node.colorClass);


        // sizes
        const sizes = {
            radius: node.weight,
            textSize: fontSize,
            textX: -3,
            textY: 0,
        };


        return (
            <>
                <circle
                    fill={fillColor}
                    stroke={strokeColor}
                    // strokeWidth={2}
                    r={sizes.radius}
                />
                <g style={{ fontSize: sizes.textSize + 'px' }}>
                    <text
                        x={sizes.textX}
                        y={sizes.textY}
                    >
                        {node.label}
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


    return (
        <div style={containerStyle}>
            {console.log("coocmap render")}
            {
                matrixData ? <Graph
                    data={matrixData}
                    NodeComponent={Node}
                    LineComponent={Line}
                    nodeDistance={500}
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
