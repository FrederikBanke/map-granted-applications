import React from 'react'
import PropTypes from 'prop-types'

/**
 * 
 * @param {Object} props 
 * @param {[]} props.projects
 */
function Sentences(props) {
    return (
        <div>
            {
                props.projects.map((value, index) => (
                    <div key={value.id}>
                        <h3>Title: {value.title}</h3>
                        {
                            value.sentences.map((value, index) => (
                                <p key={index}> {value}</p>
                            ))
                        }
                    </div>
                ))
            }
        </div >
    )
}

Sentences.propTypes = {
    projects: PropTypes.arrayOf(Object).isRequired
}

export default Sentences

