import React from 'react'

export default function Test() {
    const getProjects = () => {
        fetch('http://localhost:8000/api/projects/')
            .then(res => {
                console.log(res);

                return res.json();
            })
            .then(res => {
                console.log(res);
            })
    }
    return (
        <div>
            <p>Text</p>
            <button onClick={getProjects} >Click me!</button>
        </div>
    )
}
