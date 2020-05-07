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
 * @returns {Object}
 */
export const formatDataForCoOccurrenceMatrix = (vocabulary, wordWeights, coOccurrenceMatrix, coOccurrenceThreshold=0) => {
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
            console.error("Could not find word in vocabulary");
            return;
        }

        const weight = word1.value;
        let node = createNode(word, weight, 0);
        nodes.push(node);
    });

    const minEdgeSize = 0;
    const maxEdgeSize = 1;

    console.log("Min and max", minEdgeSize, maxEdgeSize);
    

    for (let row = 0; row < coOccurrenceMatrix.length - 1; row++) {
        for (let column = row + 1; column < coOccurrenceMatrix.length; column++) {
            const coOccurrenceValue = coOccurrenceMatrix[row][column];
            const sourceNode = vocabulary[row];
            const targetNode = vocabulary[column];
            if (coOccurrenceValue > coOccurrenceThreshold) {
                let edge = createEdge(sourceNode, targetNode, coOccurrenceValue, minEdgeSize, maxEdgeSize);
                edges.push(edge);
            } else {
                // let edge = createEdge(sourceNode, targetNode, 0, minEdgeSize, maxEdgeSize);
                // edges.push(edge);
            }
        }
    }
    return { nodes, links: edges };
}

const isInNodes = (node, nodes) => {

    for (const element of nodes) {
        if (element.id === node) {
            return true;
        }
    }
    return false;
}

const createNode = (id, weight, colorClass) => {
    return { id, weight, colorClass }
}

const createEdge = (source, target, weight, min, max) => {
    // const normWeight = sizeNormalizer(weight, min, max, 3, 6);
    const normWeight = weight * 20;
    // console.log("Edge size", normWeight);
    
    return { "source": source, "target": target, weight: normWeight }
}


/**
 * Normalize number.
 * @param {Number} value 
 * @param {Number} min 
 * @param {Number} max 
 * @param {Number} minLimit 
 * @param {Number} maxLimit 
 * @returns {Number}
 */
export const sizeNormalizer = (value, min, max, minLimit, maxLimit) => {
    let normalizedSize = (maxLimit - minLimit) / (max - min) * (value - max) + maxLimit;

    return normalizedSize;
}

export const findMaxValue = (listOfNumbers) => {
    return Math.max(...listOfNumbers);
}

export const findMinValue = (listOfNumbers) => {
    return Math.min(...listOfNumbers);
}