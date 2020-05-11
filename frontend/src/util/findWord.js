/**
 * Find every occurrence of a word in a project. Returns a list of the sentences where the words is in.
 * @param {string} word The word to find
 * @param {[Object]} projects A list of projects to look in.
 * @returns {[string]} A list of sentences (`strings`)
 */
export function findWordProject(word, projects) {
    let projectSentences = []
    projects.forEach(project => {
        let sentencesList = findSentences(project.objective, word)
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
export function findSentences(text, word = null) {
    // Matches with sentences, where we allow decimal numbers.
    let nonSentenceEnder = `[^.!?]`;
    let wordPrefix = `(\\s|^|-|,)`;
    let re;
    if (word) {
        re = new RegExp(`${nonSentenceEnder}*${wordPrefix}${word}((\\s|-|,)(?:[^!?.]|\\.(?=\\d))*)*([!?.]|$)`, 'gim');
    } else {
        re = new RegExp(`${nonSentenceEnder}*([!?.]|$)`, 'gim');
    }
    let match = text.match(re);
    return match;
}

/** 
 * Find position of word in a sentence. Returns index.
 * @param {String} word 
 * @param {String} sentence 
 * @returns {[Number]}
 */
export function findWordSentence(word, sentence) {
    let indexList = [];
    let pos = 0;

    let re = new RegExp(`([\\s.!?,-]|^)${word}([\\s.,!?-]|$)`, 'gim');

    while (true) {
        let index = sentence.regexIndexOf(re, pos);
        if (index === -1) {
            break;
        }
        // increment by 1 since it takes the space before the word as well
        if (index > 0) {
            index++;
        }

        indexList.push(index);
        pos = index + word.length;
    }

    return indexList;
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