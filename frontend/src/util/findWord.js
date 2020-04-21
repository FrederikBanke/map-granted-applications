/**
 * 
 * @param {string} word 
 * @param {[Object]} projects 
 */
export function findWordProject(word, projects) {
    let projectSentences = []
    projects.forEach(project => {
        let sentencesList = findSentences(word, project.objective)
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

function findSentences(word, text) {
    // let testSentence = "A bad sentence. A test sentence with 1.0 as a number, and 1,0 as well! Now for something else. More test.More test."
    // [^.!?]*test(?:[^\!?.]|\.(?=\d))*[\!?.]
    // Matches with sentences, where we allow decimal numbers.
    let re = new RegExp(`[^.!?]*\\s${word}(\\s(?:[^!?.]|.(?=\\d))*)*[!?.]`, 'gim');
    let match = text.match(re);
    return match;    
}

/**
 * Find position of word in a sentence. Returns index.
 * @param {String} word 
 * @param {String} sentence 
 */
export function findWordSentence(word, sentence) {
    let re = new RegExp(`[\\s.!?]${word}[\\s.!?]`, 'gim');
    let index = sentence.search(re);
    return index;  
}
