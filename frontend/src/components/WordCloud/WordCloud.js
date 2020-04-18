import React, { useEffect, useState } from 'react'
import { submitProject } from '../../util/projectSubmission';

export default function WordCloud() {
    const [words, setWords] = useState({});

    useEffect(() => {
        console.log("WordCloud mounted");
        let userProject = submitProject();

        fetch("http://localhost:8000/api/wordcloud/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "text": userProject.Abstract,
                "user_project": { "id": 1, "titel": "Our project", "objective": "Our project objective" }
            })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                setWords(res);
            })

        return (() => {
            console.log("WordCloud unmounted");

        })
    }, [])

    return (
        <div>
            <h1>Word Cloud here</h1>
            {
                Object.keys(words).map((item, i) => (
                    <p key={item}>{item} : {words[item]}</p>
                ))
            }

        </div>
    )
}
