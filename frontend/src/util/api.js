/**
 * Uses @function fetch to call our backend at the `endpoint`.
 * If `method` is 'POST' it will use `body` as the request body.
 * It returns a `Promise` where the JSON is already extracted from the request.
 * @param {String} endpoint API endpoint
 * @param {String} method http request type. Default is 'GET'.
 * @param {Object} body Request body. Default is `null`.
 * @returns {Promise} A `Promise` where the resolved value is response JSON.
 */
export const callApi = (endpoint, method = 'GET', body = null) => {
    if (method === 'GET') {
        return fetch(`${process.env.REACT_APP_BACKEND}/api/${endpoint}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "cors"
        })
            .then(res => res.json())
    }
    else if (method === 'POST') {
        return fetch(`${process.env.REACT_APP_BACKEND}/api/${endpoint}/`, {
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
 * Format word weights data. Puts the words and their weights in a `list`.
 * 
 * The output will look like:
 * @example
 * [
 *  {
 *   text: "word",
 *   value: 1
 *  }
 * ...
 * ]
 * @param {Object} data An `Object` with keys: `text` and `value`.
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
 * @param {[]} weights `list` of weights
 * @param {Number} scale The number to multiply with
 * @returns {[]} `List` of `objects` with keys: `text` and `value`.
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
 * Take a subset of the provided words.
 * @param {[]} list 
 * @param {Number} number 
 * @returns {[]} A new `list`
 */
export const subsetWords = (list, number = list.length) => {
    //FIXME: Could just use slice directly.
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

/**
 * Helper function for comparing word weights.
 * @param {Object} a 
 * @param {Object} b 
 */
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