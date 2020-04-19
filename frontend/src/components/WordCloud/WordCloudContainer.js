import React, { useEffect, useState } from 'react'
import WordCloud from "react-d3-cloud";
import callApi from '../../util/callApi';

export default function WordCloudContainer(props) {
    const [words, setWords] = useState([{ text: "word", value: 30 }, { text: "cloud", value: 30 },{ text: "being", value: 10 },{ text: "generated", value: 20 }]);
    const [maxWord, setMaxWord] = useState({ text: "word", value: 30 });
    const [minWord, setMinWord] = useState({ text: "being", value: 10 })
    const [isRotate, setIsRotate] = useState(false);

    useEffect(() => {
        console.log("WordCloud mounted");

        callApi('wordweight', 'POST', {
            "text": props.text,
            "user_project": props.userProject || null
        })
            .then(res => {
                let formattedData = formatData(res)
                setWords(formattedData);
            });

        return (() => {
            console.log("WordCloud unmounted");

        })
    }, [])

    useEffect(() => {
        let maxWord = findMax(words);
        let minWord = findMin(words);
        setMaxWord(maxWord);
        setMinWord(minWord);
    }, [words])

    const formatData = (data) => {
        let newData = [];
        Object.keys(data).map((key, i) => {
            let scaledInteger = Math.floor(data[key] * 1000)
            let element = { text: key, value: scaledInteger }
            newData.push(element)
        });
        return newData;
    }

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

    const fontSizeMapper = word => {
        const maxLimit = 72;
        const minLimit = 6;
        const max = maxWord.value;
        const min = minWord.value;

        let fontSize = (maxLimit - minLimit) / (max - min) * (word.value - max) + maxLimit;

        return fontSize;
    }
    const rotate = word => {
        return isRotate
            ? word.value % 60 * posOrNeg()
            : 0
    }

    const toggleRotate = () => {
        isRotate ? setIsRotate(false) : setIsRotate(true)
    }

    return (
        <div>
            <h1>Word Cloud here</h1>
            <button onClick={toggleRotate}>Rotate</button>
            {
                words.length > 0
                    ? <WordCloud
                        data={words}
                        fontSizeMapper={fontSizeMapper}
                        rotate={rotate}
                        padding={2}
                    />
                    : null
            }


        </div>
    )
}
