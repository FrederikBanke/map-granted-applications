import React from 'react';

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

    /**
     * Upload all of the projects to the database. Should not be used more than once.
     */
    const uploadData = () => {
        fetch('http://localhost:8000/api/math/', {
            method: 'POST'
        })
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
