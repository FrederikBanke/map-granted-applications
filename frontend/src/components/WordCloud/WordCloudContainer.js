import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
// import WordCloud from "react-d3-cloud";
import WordCloud from "react-wordcloud";
import { formatData, callApi, subsetWords } from '../../util/api';
import { findWordProject } from '../../util/findWord';
import Sentences from '../Sentences/Sentences';
import { getRandomColor, getPrimaryColor, getQuaternaryColor } from '../../util/colors';
import { combineTexts } from '../../util/projects';

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
    const [maxWord, setMaxWord] = useState({});
    const [minWord, setMinWord] = useState({})
    const [isRotate, setIsRotate] = useState(false);
    const [viewSentences, setViewSentences] = useState(false);
    const [sentences, setSentences] = useState([]);
    const [currentWord, setCurrentWord] = useState("");

    const containerStyle = {
        width: "100%",
        height: "fit-content",
        maxHeight: "500px"
    }

    useEffect(() => {
        console.log("WordCloud mounted");

        callApi('wordweight', 'POST', {
            "text": combineTexts(props.projects),
            "user_project": props.userProject || null
        })
            .then(res => {
                // console.log(res);
                let formattedData = formatData(res);
                let subset = subsetWords(formattedData);
                // console.log(formattedData);
                // console.log(subset);

                setWords(subset);
                props.setWords(subset);
            });

        return (() => {
            console.log("WordCloud unmounted");
            props.setWords([]);
        });
    }, [props.text])

    useEffect(() => {
        let maxWord = findMax(words);
        let minWord = findMin(words);
        setMaxWord(maxWord);
        setMinWord(minWord);
    }, [words])


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

    const posOrNeg = () => {
        const rand = Math.random()
        return rand > 0.5 ? 1 : -1;
    }

    /**
     * 
     * @param {Word} word 
     * @param {[]} list 
     */
    const isWordInList = (word, list) => {
        // console.log(word);
        // console.log(list);

        for (const value of list) {
            //    console.log(`Compare ${word.text} with ${value.text}`);
            if (word.text === value.text) {
                return true;
            }
        }
        return false;
    }

    // const fontSizeMapper = word => {
    //     const maxLimit = 92; // 143 is max for 800x800 canvas
    //     const minLimit = 6;
    //     const max = maxWord.value;
    //     const min = minWord.value;

    //     let fontSize = (maxLimit - minLimit) / (max - min) * (word.value - max) + maxLimit;
    //     // console.log(`${word.text} font size: ${fontSize}`);

    //     return fontSize;
    // }
    // const rotate = word => {
    //     return isRotate
    //         ? word.value % 60 * posOrNeg()
    //         : 0
    // }

    const refresh = () => {
        isRotate ? setIsRotate(false) : setIsRotate(true) // just used to refresh word cloud
    }

    const onWordClick = word => {
        // console.log(word.text);
        let projectSentences = findWordProject(word.text, props.projects);
        // console.log(projectSentences);
        setCurrentWord(word.text);
        setSentences(projectSentences);
        setViewSentences(true);
    }

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
        fontSizes: [12, 92],
        rotationAngles: [0, 0],
        rotations: 1,
        // colors: ["#de7f3f", "#1680b2", "#052b58"],
        deterministic: true
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