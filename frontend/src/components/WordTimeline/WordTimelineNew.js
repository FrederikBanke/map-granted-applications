import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { combineTexts, groupProjectsByYear, extractProjectObjectives } from '../../util/projects';
import { callApi, formatWordWeightsData, sortWordWeights, subsetWords } from '../../util/api';
import { Chart } from "react-google-charts";
import { formatDataForCharts } from '../../util/charts';
import ReactTooltip from 'react-tooltip';

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
            <ReactTooltip place="right" effect="solid" multiline="true" />
            <span className="head2" >Word Timeline</span><span style={{ fontSize: "13px" }} data-tip="If a word has a score of 0, it does not always mean, it was never used. <br /> It could just mean, it wasn’t among the top 10000 most important words that year."> ❔</span>
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
            <input className="hover" onClick={props.onClickCheckBox} type="checkbox" name={props.text} value={props.text} checked={props.isChecked} />
            <label for={props.text}>{props.text}</label><br />
        </React.Fragment>

    );
}

WordElement.propTypes = {
    onClickCheckBox: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    isChecked: PropTypes.bool.isRequired,
}