/**
 * Find every occurrence of a word in a project. Returns a list of the sentences where the words is in.
 * @param {string} word The word to find
 * @param {[Object]} projects A list of projects to look in.
 * @returns {[object]} A list of objects with keys: id, title, sentences ([string]).
 */
export function findWordProject(word, projects) {
    let findInSentences = word.includes(" ") ? findBigramSentences : findMonogramSentences;
    let projectSentences = []
    projects.forEach(project => {
        let sentencesList = findInSentences(project.objective, word)
        if (sentencesList) {
            projectSentences.push({
                id: project.id,
                title: project.title,
                sentences: sentencesList
            })
        }
    });
    return projectSentences;
}

/**
 * Find the sentences where `word` occurs.
 * @param {String} text 
 * @param {String} word 
 */
export function findMonogramSentences(text, word = null) {
    // Matches with sentences, where we allow decimal numbers.
    let nonSentenceEnder = `[^.!?]`;
    let wordPrefix = `(\\s|^|-|,|\\()`;
    let re;
    if (word) {
        re = new RegExp(`${nonSentenceEnder}*${wordPrefix}${word}((\\s|-|,|;|:)(?:[^!?.]|\\.(?=\\d))*)*([!?.]|$)`, 'gim');
    } else {
        re = new RegExp(`${nonSentenceEnder}*([!?.]|$)`, 'gim');
    }
    let match = text.match(re);
    return match;
}

/**
 * Find a bi-gram in the sentences where `term` occurs.
 * @param {String} text 
 * @param {String} term 
 */
export function findBigramSentences(text, term = null) {
    let words = term.split(" ");
    // Matches with sentences, where we allow decimal numbers.
    let nonSentenceEnder = `[^.!?]`;
    let wordPrefix = `(\\s|^|-|,|\\()`;
    let re;
    re = new RegExp(`${nonSentenceEnder}*${wordPrefix}${words[0]}${nonSentenceEnder}*?${words[1]}((\\s|-|,|;|:)(?:[^!?.]|\\.(?=\\d))*)*([!?.]|$)`, 'gim');

    let match = text.match(re);
    return match;
}

/** 
 * Find position of word in a sentence. Returns index.
 * @param {String} words 
 * @param {String} sentence 
 * @returns {[[Number]]} A list of tuples with start and end indexes
 */
export function findWordSentence(words, sentence) {
    let indexList = [];
    let pos = 0;

    words.forEach(word => {
        let re = new RegExp(`([\\s.!?,(-]|^)${word}([\\s.,!?;:)-]|$)`, 'gim');

        while (true) {
            let index = sentence.regexIndexOf(re, pos);
            if (index === -1) {
                break;
            }
            // increment by 1 since it takes the space before the word as well
            if (index > 0) {
                index++;
            }
            pos = index + word.length;
            indexList.push([index, pos]);
        }

    });
    indexList.sort(sortOnColumn)
    return indexList;
}

/**
 * Sorts a multi dimensional array based on the leftmost column value
 * @param {*} a 
 * @param {*} b 
 */
const sortOnColumn = (a, b) => {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

/**
 * Find the index of a substring using a regular expression to match.
 * @param {RegExp} regex Regular expression to find index of
 * @param {number} startpos Start position in string to search from
 */
String.prototype.regexIndexOf = function (regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}