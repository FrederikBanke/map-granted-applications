import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { combineTexts, groupProjectsByYear, extractProjectObjectives } from '../../util/projects';
import { callApi, formatWordWeightsData, sortWordWeights, subsetWords } from '../../util/api';
import { Chart } from "react-google-charts";
import { formatDataForCharts } from '../../util/charts';

/**
 * 
 * @param {Object} props 
 * @param {[]} props.projects
 */
const WordTimelineNew = props => {
    const containerStyle = {
        display: "flex",
        width: "100%",
        height: "10%",
        flexFlow: "row"
    }

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <h2>Word Timeline All</h2>
            <div style={containerStyle}>
                {
                    React.Children.map(props.children, child => (
                        child
                    ))
                }
            </div >

        </div >
    )
}

WordTimelineNew.propTypes = {
    allWords: PropTypes.arrayOf(Object),
    weightsByYear: PropTypes.objectOf(PropTypes.arrayOf(Object))
}

export default WordTimelineNew;

export const WordList = props => {
    const listStyle = {
        textAlign: "left",
        height: "100%",
        maxHeight: "800px",
        width: "200px",
        overflowY: "auto"
    }

    return (
        <div style={listStyle}>
            {
                React.Children.map(props.children, child => (
                    child
                ))
            }
        </div>
    );
}

export const WordElement = props => {
    return (
        <React.Fragment>
            <input onClick={props.onClickCheckBox} type="checkbox" name={props.text} value={props.text} checked={props.isChecked} />
            <label for={props.text}>{props.text}</label><br />
        </React.Fragment>

    );
}

WordElement.propTypes = {
    onClickCheckBox: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    isChecked: PropTypes.bool.isRequired,
}