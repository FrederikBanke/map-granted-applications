import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Graph from "react-graph-network";
import { callApi, formatWordWeightsData, sortWordWeights, scaleWordWeights } from '../../util/api';
import { formatDataForCoOccurrenceMatrix, findMaxValue } from '../../util/charts';
import { subsetProjects, combineTexts, extractProjectObjectives } from '../../util/projects';
import { getTermsFromList } from '../../util/weights';
import { getQuaternaryColor, getQuinaryColor, getPrimaryColor, getSecondaryColor, getTertiaryColor, getVisualPrimaryColor, getVisualSecondaryColor, getVisualPrimaryColorLight, getVisualSecondaryColorLight, getVisualQuaternaryColor, getVisualQuaternaryColorLight } from '../../util/colors';

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

        // callApi('filterobjectives', 'POST', {
        //     texts: extractProjectObjectives(props.projects),
        //     weights: props.wordWeights
        // })
        //     .then(res => {
        // let formattedWeightsData = formatWordWeightsData(res.wordWeights);
        // let weights = sortWordWeights(formattedWeightsData);
        callApi('cooccurrencematrix', 'POST', {
            // "texts": res.filteredObjectives,
            "texts": props.objectives,
            "vocabulary": getTermsFromList(props.wordWeights)
        })
            .then((vocabAndMatrix) => {
                let scaledWeights = scaleWordWeights(props.wordWeights, 1000);
                let normWeights = sizeNormalizer(scaledWeights);
                const flattenedMatrix = vocabAndMatrix.coOccurrenceMatrix.flat();
                let sumMatrix = flattenedMatrix.reduce((a, b) => {
                    return a + b;
                }, 0);

                const threshold = sumMatrix / (flattenedMatrix.length);

                let formattedMatrixData = formatDataForCoOccurrenceMatrix(
                    vocabAndMatrix.vocabulary, normWeights,
                    vocabAndMatrix.coOccurrenceMatrix, threshold,
                    props.wordsToColor
                );

                setMatrixData(formattedMatrixData);
            });
        // });

    }, [props.projects]);

    const getColor = colorClass => {
        const colors = [
            [getVisualSecondaryColor(), getVisualSecondaryColorLight()],
            [getVisualQuaternaryColor(), getVisualQuaternaryColorLight()],
        ];

        return colors[colorClass];
    }

    const Line = ({ link, ...restProps }) => {
        // console.log(data.nodes);

        const sourceNode = matrixData.nodes.find((value) => {
            // console.log(`${link.source}`);

            if (typeof link.source !== 'string') {
                return false
                throw new TypeError(`link.source is not a string. It is ${typeof link.source}`)
            }


            return value.id === link.source;
        });

        if (typeof sourceNode === 'undefined') {
            return <line
                {...restProps}
                stroke={"#000000c0"}
                strokeWidth={link.weight}
            />
            throw new TypeError(`Could not find node with id: ${link.source}`)
        }

        const color = getColor(sourceNode.colorClass)[1] + "c0";
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
    wordsToColor: PropTypes.array,
    wordWeights: PropTypes.arrayOf(Object),
    objectives: PropTypes.arrayOf(String)
}

export default CooccurrenceMap
