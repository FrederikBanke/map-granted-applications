/**
 * Function for formatting the data, so it works with the bar graph chart.
 * @param {*} data Data to format
 * @param {[]} words Words to show on graph
 */
export const formatDataBarGraph = (data, words) => {
    let formattedData = [];
    formattedData.push(['year']);
    for (const year in data) {
        if (data.hasOwnProperty(year)) {
            formattedData.push([year]);
        }
    }
    words.forEach(word => {
        formattedData[0].push(word);
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
    console.log("Done formatting");
    
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


// [
//     ['Year', 'neuronal', 'synapses'],
//     ['2014', 8175000, 8008000],
//     ['2015', 3792000, 3694000],
//     ['2016', 2695000, 2896000],
//     ['2017', 2099000, 1953000],
//     ['2018', 1526000, 1517000],
// ]

export const chooseColumn = () => {

}