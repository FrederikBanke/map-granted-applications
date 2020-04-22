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
    const [project, setProject] = useState(null);
    const [projectId, setProjectId] = useState("");

    const wordStyle = {
        color: 'limegreen',
        fontWeight: '700'
    }

    const containerStyle = {
        width: "50%",
        height: "400px",
        overflowY: "auto",
        margin: "auto"
    }

    /**
     * 
     * @param {String} sentence 
     * @param {String} clickedWord 
     */
    const renderSentence = (sentence, clickedWord, key) => {
        if (clickedWord) {
            let index = findWordSentence(clickedWord, sentence);

            let before = sentence.substr(0, index);
            let word = sentence.substr(index, clickedWord.length + 1)
            let after = sentence.substr(index + clickedWord.length + 1);
            return (
                <p key={key}>{before}<span style={wordStyle}>{word}</span>{after}</p>
            )
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

