import { isWordInList } from "./wordCloud";
import { getVisualPrimaryColor, getVisualSecondaryColor } from "./colors";

/**
 * Function for formatting the data, so it works with the google charts.
 * 
 * The format of the input data:
 * 
 * {
 *  'Object 1': 
 *   [
 *     {
 *       "text": "Line 1",
 *       "value": line1Value
 *     }
 *   ]
 * }
 * 
 * 
 * The format of the data returned:
 * 
 * [['x-axis unit', 'line 1 name', 'line 2 name'],
 * [xAxisValue1, line1Value1, line2Value1],
 * [xAxisValue2, line1Value2, line2Value2]]
 * 
 * @example
 * [
    ['x', 'dogs', 'cats'],
    [0, 0, 0],
    [1, 10, 5],
    [2, 23, 15],
    [3, 17, 9],
    [4, 18, 10],
    [5, 9, 5],
    [6, 11, 3],
    [7, 27, 19],
  ]
 * 
 * @param {*} data Data to format
 * @param {[]} words Words to show on graph
 * @returns {[]} A list of lists
 */
export const formatDataForCharts = (data, words) => {
    let formattedData = [];
    formattedData.push(['year']);
    for (const year in data) {
        if (data.hasOwnProperty(year)) {
            formattedData.push([year]); // FIXME: Perhaps cast year to an int
        }
    }

    words.forEach(word => {
        formattedData[0].push(word); // push each word to the first row
        for (let index = 1; index < formattedData.length; index++) {
            formattedData[index].push(0); // initialize all weights as 0
        }
    });

    for (const year in data) {
        if (data.hasOwnProperty(year)) {
            const weights = data[year];
            weights.forEach(element => {
                let wordIndex = words.indexOf(element.text);
                if (wordIndex >= 0) {
                    let rowIndex = findRow(formattedData, year);

                    formattedData[rowIndex][wordIndex + 1] = element.value;
                }
            });
        }
    }

    return formattedData;
}




/**
 * Find index for row
 * @param {[]} list
 * @param {String} term
 * @returns {number} Retruns found index. Returns -1 if nothing was found.
 */
const findRow = (list, term) => {
    let index = 0;
    for (const element of list) {
        if (element[0] === term) {
            return index;
        }
        index++;
    }
    return -1;
}

/**
 * Format data for the co-occurrence map.
 * @param {[]} vocabulary 
 * @param {[Object]} wordWeights
 * @param {[[]]} coOccurrenceMatrix 
 * @param {[]} wordsToColor Words in chosen project
 * @returns {Object}
 */
export const formatDataForCoOccurrenceMatrix = (vocabulary, wordWeights, coOccurrenceMatrix, coOccurrenceThreshold = 0, wordsToColor, minEdge, maxEdge) => {
    let nodes = [];
    let edges = [];

    vocabulary.forEach((word, index) => {
        const word1 = wordWeights.find((value => {
            if (value.text === word) {
                return true;
            }
            return false;

        }))
        if (word1 === undefined) {
            throw new TypeError(`word1 is undefined. Could not find '${word}' in word weights list.`)
        }
        let color;
        if (wordsToColor.includes(word)) {
            color = getVisualPrimaryColor();

        } else {
            color = getVisualSecondaryColor();
        }

        const weight = word1.value;
        let node = createNode(word, weight, color, word, nodes);
        nodes.push(node);

    });


    for (let row = 0; row < coOccurrenceMatrix.length - 1; row++) {
        for (let column = row + 1; column < coOccurrenceMatrix.length; column++) {
            const coOccurrenceValue = coOccurrenceMatrix[row][column];
            const sourceNode = vocabulary[row];
            const targetNode = vocabulary[column];
            if (coOccurrenceValue >= coOccurrenceThreshold) {
                let edge = createEdge(sourceNode, targetNode, coOccurrenceValue, coOccurrenceThreshold);
                edges.push(edge);
            } else {
                // let edge = createEdge(sourceNode, targetNode, 0, minEdgeSize, maxEdgeSize);
                // edges.push(edge);
            }
        }
    }
    return { nodes, edges };
}

const isInNodes = (node, nodes) => {

    for (const element of nodes) {
        if (element.id === node) {
            return true;
        }
    }
    return false;
}

/**
 * Create node for co-occurrence map.
 * @param {string} id 
 * @param {number} weight 
 * @param {string} color 
 * @param {string} label 
 * @param {[Object]} nodes 
 */
const createNode = (id, weight, color, label, wordsToCompare) => {
    if (typeof id !== 'string') {
        throw new TypeError(`Node id was not a string: ${typeof id}`)
    }
    if (typeof weight !== 'number') {
        throw new TypeError(`Node weight was not a number: ${typeof weight}`)
    }
    if (typeof color !== 'string') {
        throw new TypeError(`Node colorClass was not a number: ${typeof color}`)
    }
    if (typeof label !== 'string') {
        throw new TypeError(`Node label was not a string: ${typeof label}`)
    }
    isWordInList(id, wordsToCompare)
    return {
        id,
        title: "This is a title",
        color,
        label,
        // widthConstraint: weight*10,
        // font: {
        //     size: weight // Nodes are scaled after the labe, so this scales node sizes
        // }
    }
}

/**
 * Create an edge for co-occurrence map.
 * @param {String} source 
 * @param {String} target 
 * @param {Number} weight 
 */
const createEdge = (source, target, weight, minValue=0, maxValue=1) => {
    if (typeof source !== 'string') {
        throw new TypeError(`Edge source was not a string: ${typeof source}`)
    }
    if (typeof target !== 'string') {
        throw new TypeError(`Edge target was not a string: ${typeof target}`)
    }
    if (typeof weight !== 'number') {
        throw new TypeError(`Edge weight was not a number: ${typeof weight}`)
    }
    const width = sizeNormalizer(weight, minValue, maxValue, 1, 30);
    const length = 1100 - sizeNormalizer(weight, minValue, maxValue, 100, 1000);
    // const length = 300 - Math.pow(3, weight);
    // const width = Math.pow(10, (weight+1)*10);

    return { "from": source, "to": target, width}
}


/**
 * Normalize number.
 * @param {Number} value 
 * @param {Number} minValue 
 * @param {Number} maxValue 
 * @param {Number} minLimit 
 * @param {Number} maxLimit 
 * @returns {Number}
 */
export const sizeNormalizer = (value, minValue, maxValue, minLimit, maxLimit) => {
    let normalizedSize = (maxLimit - minLimit) / (maxValue - minValue) * (value - maxValue) + maxLimit;

    return normalizedSize;
}

/**
 * Finds the maximum number in a list of numbers
 * @param {[Number]} listOfNumbers 
 * @returns {Number} Maximum number in list
 */
export const findMaxValue = (listOfNumbers) => {
    return Math.max(...listOfNumbers);
}

/**
 * Finds the minimum number in a list of numbers
 * @param {[Number]} listOfNumbers 
 * @returns {Number} Minimum number in list
 */
export const findMinValue = (listOfNumbers) => {
    return Math.min(...listOfNumbers);
}