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
 * @param {*} data 
 */
export const formatData = (data) => {
    let newData = [];
    //FIXME: Should not use the map function like this.
    Object.keys(data).map((key, i) => {
        let scaledInteger = Math.floor(data[key] * 1000)
        let element = { text: key, value: scaledInteger }
        newData.push(element)
    });
    return newData;
}

    /**
     * 
     * @param {[]} list 
     * @param {Number} number 
     */
    export const subsetWords = (list, number = 0) => {
        if (number === 0) {
            let sortedList = list.sort(compareWordsWeightDesc);
            return sortedList;
        }
        let sortedList = list.sort(compareWordsWeightDesc);
        return sortedList.slice(0, number);
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