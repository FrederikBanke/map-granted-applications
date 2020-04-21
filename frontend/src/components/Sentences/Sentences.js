import React from 'react'
import PropTypes from 'prop-types'
import { findWordSentence } from "./../../util/findWord";

/**
 * 
 * @param {Object} props 
 * @param {[]} props.projects
 * @param {String} props.word
 * 
 */
function Sentences(props) {

    const wordStyle = {
        color: 'red'
    }

    /**
     * 
     * @param {String} sentence 
     * @param {String} clickedWord 
     */
    const renderSentence = (sentence, clickedWord) => {
        if (clickedWord) {
            let index = findWordSentence(clickedWord, sentence);
            
            let before = sentence.substr(0, index);
            let word = sentence.substr(index, clickedWord.length + 1)
            let after = sentence.substr(index + clickedWord.length + 1);
            return (
                <p>{before}<span style={wordStyle}>{word}</span>{after}</p>
            )
        }
        return <p>{sentence}</p>

    }

    return (
        <div>
            {
                props.projects.map((value, index) => (
                    <div key={value.id}>
                        <h3>Title: {value.title}</h3>
                        {
                            value.sentences.map((value, index) => (
                                renderSentence(value, props.word)
                            ))
                        }
                    </div>
                ))
            }
        </div >
    )
}

Sentences.propTypes = {
    projects: PropTypes.arrayOf(Object).isRequired,
    word: PropTypes.string
}

export default Sentences

