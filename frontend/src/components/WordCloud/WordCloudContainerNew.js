import React from 'react'
import PropTypes from 'prop-types'
import WordCloud from "react-wordcloud";
import { isWordInList } from '../../util/wordCloud';
import { getQuaternaryColor, getRandomColor, getVisualQuaternaryColor, getVisualQuinaryColor, getVisualSecondaryColorLight, getVisualPrimaryColor } from '../../util/colors';

const WordCloudContainerNew = props => {

    const containerStyle = {
        width: "100%",
        height: "fit-content",
        maxHeight: "500px"
    }

    const wordCloudMinSize = [200, 200];

    const wordCloudOptions = {
        fontSizes: [12, 42],
        rotationAngles: [0, 0], // min and max rotation angle
        rotations: 1, // rotation steps
        // colors: ["#de7f3f", "#1680b2", "#052b58"],
        deterministic: true // keep same word placements
    };

    /**
 * Set the color of the word. If only one word cloud is viewable, set random colors for words.
 * If both word clouds are present, set same color for words that appear in both clouds, and black if they are unique.
 * @param {Object} word Word to set color for
 * @returns {string} String representing a color
 */
    const setWordCloudColor = word => {
        if (props.compare) {
            if (isWordInList(word.text, props.wordsToCompare)) {
                return getVisualPrimaryColor();
            }
            return getVisualSecondaryColorLight();
        }
        else {
            return getRandomColor();
        }
    }

    /**
     * When a word is clicked in the word cloud. Change current word in state and find sentences where the word occurs.
     * @param {Object} word Word that was clicked
     */
    const onWordClick = word => {
        props.onWordClick(word, props.type)
    }

    const wordCloudCallbacks = {
        onWordClick: onWordClick,
        getWordColor: setWordCloudColor
    };

    return (
        <div style={containerStyle} >
            <WordCloud
                words={props.words}
                options={wordCloudOptions}
                minSize={wordCloudMinSize}
                callbacks={wordCloudCallbacks}
                maxWords={50}
            />
            {
                React.Children.map(props.children, child => child)
            }
        </div>
    )
}

WordCloudContainerNew.propTypes = {
    type: PropTypes.string.isRequired,
    words: PropTypes.array,
    wordsToCompare: PropTypes.array,
    compare: PropTypes.bool,
    onWordClick: PropTypes.func,
}

export default WordCloudContainerNew
