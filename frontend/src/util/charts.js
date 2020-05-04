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

// {
//     '2014': [
//         {
//             "text": "word",
//             "value": 3
//         }
//     ]
// }

export const chooseColumn = () => {

}