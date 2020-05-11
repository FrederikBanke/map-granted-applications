/**
 * Extract terms from a list of objects.
 * @param {[]} wordWeightsList List of word weights
 */
export const getTermsFromList = wordWeightsList => {
    let terms = [];
    wordWeightsList.forEach(val => {
        terms.push(val.text)
    });
    return terms;
}