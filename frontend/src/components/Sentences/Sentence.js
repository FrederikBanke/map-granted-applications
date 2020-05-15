import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { findWordSentence } from "./../../util/findWord";
import Overlay from '../Overlay/Overlay';
import ProjectView from '../ProjectView/ProjectView';
import { getQuinaryColor } from '../../util/colors';

/**
 * 
 * @param {Object} props 
 * 
 */
function Sentence(props) {
    const [textWithHL, setTextWithHL] = useState([]);

    const wordStyle = {
        color: getQuinaryColor(),
        fontWeight: '700'
    }

    useEffect(() => {
        let words = props.highlight.split(" ");
        let indexList = findWordSentence(words, props.text);
  
        let spans = [];

        let currentIndex = 0;
        indexList.map(wordIndex => {
            const wordStart = wordIndex[0]
            const wordEnd = wordIndex[1]
            const wordLength = wordEnd - wordStart;
            let before = props.text.substr(currentIndex, wordStart - currentIndex);
            let word = props.text.substr(wordStart, wordLength);
            currentIndex = wordEnd;
            spans.push(<span>{before}<span style={wordStyle}>{word}</span></span>);
        })
        spans.push(<span>{props.text.substr(currentIndex)}</span>)
        setTextWithHL(spans);

        return(() => {
            setTextWithHL([]);
        })

    }, [props.text, props.highlight])


    return <p>
        {
            textWithHL.map(span => span)
        }
    </p>

}

Sentence.propTypes = {
    highlight: PropTypes.string,
    text: PropTypes.string,
}

export default Sentence

