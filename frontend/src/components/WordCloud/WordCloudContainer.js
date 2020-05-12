import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import WordCloud from "react-wordcloud";
import { formatWordWeightsData, callApi, sortWordWeights } from '../../util/api';
import { findWordProject } from '../../util/findWord';
import Sentences from '../Sentences/Sentences';
import { getRandomColor, getQuaternaryColor } from '../../util/colors';
import { combineTexts, extractProjectObjectives } from '../../util/projects';

/**
 * 
 * @param {Object} props 
 * @param {[]} props.projects
 * @param {[]} [props.userProject]
 * @param {Function} [props.onWordClick]
 * @param {Function} [props.onProjectChange]
 * @param {[]} [props.wordsToCompare]
 */
export default function WordCloudContainer(props) {
    const [words, setWords] = useState([]);
    const [isRotate, setIsRotate] = useState(false);
    const [viewSentences, setViewSentences] = useState(false);
    const [sentences, setSentences] = useState([]);
    const [currentWord, setCurrentWord] = useState("");
    const [maxWordsInCloud, setMaxWordsInCloud] = useState(50);

    const containerStyle = {
        width: "100%",
        height: "fit-content",
        maxHeight: "500px"
    }

    /**
     * Combines project objectives and gets the weights of the words.
     */
    useEffect(() => {
        callApi('wordweight', 'POST', {
            "text": extractProjectObjectives(props.projects),
            "user_project": props.userProject || null
        })
            .then(weightDict => {
                // console.log(res);
                let formattedData = formatWordWeightsData(weightDict);
                let sortedWordWeights = sortWordWeights(formattedData);
                // console.log(formattedData);
                // console.log(subset);
                console.log(sortedWordWeights);
                

                setWords(sortedWordWeights);
                props.setWords(sortedWordWeights.slice(0, maxWordsInCloud));
            });

        return (() => {
            console.log("WordCloud unmounted");
            props.setWords([]);
        });
    }, [props.text])


    const findMax = (data) => {
        let max = { text: null, value: 0 }
        data.forEach(word => {
            if (word.value > max.value) {
                max = word;
            }
        });
        return max;
    }

    const findMin = (data) => {
        let min = { text: null, value: 0 }
        data.forEach(word => {
            if (word.value < min.value) {
                min = word;
            }
        });
        return min;
    }

    /**
     * Check if a word is in a list of words.
     * @param {Word} word 
     * @param {[]} list 
     * @returns {boolean} `true` or `false`
     */
    const isWordInList = (word, list) => {
        for (const value of list) {
            if (word.text === value.text) {
                return true;
            }
        }
        return false;
    }

    const refresh = () => {
        isRotate ? setIsRotate(false) : setIsRotate(true) // just used to refresh word cloud
    }

    /**
     * When a word is clicked in the word cloud. Change current word in state and find sentences where the word occurs.
     * @param {Object} word Word that was clicked
     */
    const onWordClick = word => {
        let projectSentences = findWordProject(word.text, props.projects);
        setCurrentWord(word.text);
        setSentences(projectSentences);
        setViewSentences(true);
    }

    /**
     * Set the color of the word. If only one word cloud is viewable, set random colors for words.
     * If both word clouds are present, set same color for words that appear in both clouds, and black if they are unique.
     * @param {Object} word Word to set color for
     * @returns {string} String representing a color
     */
    const setWordColor = word => {
        if (props.wordsToCompare.length > 0) {
            if (isWordInList(word, props.wordsToCompare)) {
                return getQuaternaryColor();

            }
            return "#000000";
        }
        else {
            return getRandomColor();
        }
    }

    const wordCloudOptions = {
        fontSizes: [12, 42],
        rotationAngles: [0, 0], // min and max rotation angle
        rotations: 1, // rotation steps
        // colors: ["#de7f3f", "#1680b2", "#052b58"],
        deterministic: true // keep same word placements
    };

    const wordCloudMinSize = [200, 200];

    const wordCloudCallbacks = {
        onWordClick: onWordClick,
        getWordColor: setWordColor
    };

    return (
        <div style={containerStyle}>
            <button onClick={refresh}>Refresh</button>
            <div style={containerStyle}>
            {
                words.length > 0
                ? <WordCloud
                words={words}
                options={wordCloudOptions}
                minSize={wordCloudMinSize}
                callbacks={wordCloudCallbacks}
                maxWords={maxWordsInCloud}
                />
                : <p>Generating word cloud...</p>
            }
            </div>
            <div style={containerStyle}>
            {
                viewSentences
                ? <Sentences onProjectChange={props.onProjectChange} projects={sentences} word={currentWord} />
                : null
            }
            </div>
        </div>
    )
}

WordCloudContainer.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.object).isRequired,
    userProject: PropTypes.object,
    onWordClick: PropTypes.func,
    onProjectChange: PropTypes.func,
    wordsToCompare: PropTypes.array,
    setWords: PropTypes.func
}