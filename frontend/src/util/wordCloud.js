/**
     * Check if a word is in a list of words.
     * @param {Word} word 
     * @param {[]} list 
     * @returns {boolean} `true` or `false`
     */
export const isWordInList = (word, list) => {
    for (const value of list) {
        if (word.text === value.text) {
            return true;
        }
    }
    return false;
}


