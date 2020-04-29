/**
 * 
 * @param {string} word 
 * @param {[Object]} projects 
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
export function findSentences(text, word = '') {
    // let testSentence = "A bad sentence. A test sentence with 1.0 as a number, and 1,0 as well! Now for something else. More test.More test."
    // [^.!?]*test(?:[^\!?.]|\.(?=\d))*[\!?.]
    // Matches with sentences, where we allow decimal numbers.
    let nonSentenceEnder = `[^.!?]`;
    let wordPrefix = `(\\s|^|-|,)`;
    let re = new RegExp(`${nonSentenceEnder}*${wordPrefix}${word}((\\s|-|,)(?:[^!?.]|\\.(?=\\d))*)*([!?.]|$)`, 'gim');
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
    // console.log("Looking for word:", word);
    // console.log("In sentence:", sentence);
    let indexList = [];
    let pos = 0;

    let re = new RegExp(`([\\s.!?,-]|^)${word}([\\s.,!?-]|$)`, 'gim');
    // let index = sentence.search(re);

    while (true) {
        // let index = sentence.indexOf(word, pos)
        // let index = indexOfRegex(sentence, re, pos);
        let index = sentence.regexIndexOf(re, pos);
        if (index === -1) {
            break;
        }
        // if (index > 0) {
        //     index++;
        // }
        // console.log("Pusing index:", index);

        indexList.push(++index);
        pos = index + word.length;
    }
    // console.log("Out of log");

    return indexList;
}

String.prototype.regexIndexOf = function (regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}