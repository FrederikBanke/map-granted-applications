export const callApi = (endpoint, method = 'GET', body = null) => {
    if (method === 'GET') {
        return fetch(`http://localhost:8000/api/${endpoint}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
    }
    else if (method === 'POST') {
        return fetch(`http://localhost:8000/api/${endpoint}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
    }
}

/**
 * Format word weights. Scales the weights from decimal points to integers.
 * 
 * The output will look like:
 * @example
 * [
 *  {
 *   text: "word",
 *   value: 1
 *  }...
 * ]
 * @param {*} data 
 * @returns {[]} A list containing word weights.
 */
export const formatWordWeightsData = (data) => {
    let newData = [];
    Object.keys(data).forEach((key, i) => {
        let element = { text: key, value: data[key] }
        newData.push(element)
    });
    return newData;
}

/**
 * Scale the weight of words using the given scale. Rounds weight to integer (floor).
 * @param {[]} weights 
 * @param {Number} scale 
 */
export const scaleWordWeights = (weights, scale) => {
    let scaledWordWeights = []
    weights.forEach(word => {
        // let scaledInteger = Math.floor(word.value * scale) // Used to floor because old word cloud lib couldn't use floats
        let scaledValue = word.value * scale
        let element = { text: word.text, value: scaledValue }
        scaledWordWeights.push(element)
    })
    return scaledWordWeights;
}

/**
 * 
 * @param {[]} list 
 * @param {Number} number 
 */
export const subsetWords = (list, number = list.length) => {
    return list.slice(0, number);
}

/**
 * Sort word weigth list.
 * @param {[]} list List of word weights unsorted.
 * @returns {[]} A list sorted on weights descending
 */
export const sortWordWeights = (list) => {
    return list.sort(compareWordsWeightDesc);
}

const compareWordsWeightDesc = (a, b) => {
    if (a.value < b.value) {
        // less return negative
        return 1;
    }
    if (a.value > b.value) {
        // greater return positive
        return -1;
    }
    //  equal return 0
    return 0;
}