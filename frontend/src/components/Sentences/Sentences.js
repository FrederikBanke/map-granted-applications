import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { findWordSentence } from "./../../util/findWord";
import Overlay from '../Overlay/Overlay';
import ProjectView from '../ProjectView/ProjectView';

/**
 * 
 * @param {Object} props 
 * @param {[]} props.projects
 * @param {String} props.word
 * @param {Function} props.onProjectChange
 * 
 */
function Sentences(props) {
    const [viewProject, setViewProject] = useState(false);
    const [projectId, setProjectId] = useState("");

    const wordStyle = {
        color: 'limegreen',
        fontWeight: '700'
    }

    const containerStyle = {
        width: "90%",
        height: "600px",
        overflowY: "auto",
        // margin: "auto",
        // marginBottom: "30px",
    }

    /**
     * 
     * @param {String} sentence 
     * @param {String} clickedWord 
     */
    const renderSentence = (sentence, clickedWord, key) => {
        if (clickedWord) {
            let indexList = findWordSentence(clickedWord, sentence);
            let currentIndex = 0;

            return (<p>
                {
                    indexList.map(wordIndex => {
                        let before = sentence.substr(currentIndex, wordIndex - currentIndex);
                        let word = sentence.substr(wordIndex, clickedWord.length)
                        currentIndex = wordIndex + clickedWord.length;
                        return <span>{before}<span style={wordStyle}>{word}</span></span>
                    })
                }
                <span>{sentence.substr(currentIndex)}</span>
            </p>)
        }
        return <p key={key}>{sentence}</p>

    }

    const onTitleClick = (event) => {
        setProjectId(event.target.getAttribute('data-projectid'))
        setViewProject(true);
    }

    return (
        <div>
            {
                viewProject
                    ? (<Overlay onClickClose={setViewProject}>
                        <ProjectView onProjectChange={props.onProjectChange} id={projectId} />
                    </Overlay>)
                    : null
            }
            <div style={containerStyle}>
                {
                    props.projects.map((value, index) => (
                        <div key={value.id}>
                            <h3 onClick={onTitleClick} data-projectid={value.id} >Title: {value.title}</h3>
                            {
                                value.sentences.map((value, index) => (
                                    renderSentence(value, props.word, index)
                                ))
                            }
                        </div>
                    ))
                }
            </div >
        </div>
    )
}

Sentences.propTypes = {
    projects: PropTypes.arrayOf(Object).isRequired,
    word: PropTypes.string,
    onProjectChange: PropTypes.func
}

export default Sentences

