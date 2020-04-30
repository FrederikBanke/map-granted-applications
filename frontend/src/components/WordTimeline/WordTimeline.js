import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { combineTexts, groupProjectsByYear } from '../../util/projects';
import { callApi, formatData, subsetWords } from '../../util/api';

/**
 * 
 * @param {Object} props 
 * @param {[]} props.projects
 */
const WordTimeline = props => {
    const [weightsByYear, setWeightsByYear] = useState({});

    useEffect(() => {
        if (props.projects.length > 0) {
            let projectsByYear = groupProjectsByYear(props.projects);

            let weightsByYearResponse = {};

            let apiPromises = [];

            for (const year in projectsByYear) {
                if (projectsByYear.hasOwnProperty(year)) {
                    const projects = projectsByYear[year];
                    apiPromises.push(
                        getWordWeight(projects)
                            .then(weights => {
                                weightsByYearResponse[year] = weights;
                            })
                    );
                }
            }

            Promise.all(apiPromises)
                .then(() => {
                    setWeightsByYear(weightsByYearResponse);
                });

        }
    }, [props.projects]);

    const getWordWeight = (projects) => {
        return callApi('wordweight', 'POST', {
            "text": combineTexts(projects),
            "user_project": props.userProject || null
        })
            .then(res => {
                let formattedData = formatData(res);
                let subset = subsetWords(formattedData);
                return subset;
            });
    }




    return (
        <div>
            <h2>Word Timeline</h2>
            <WordList></WordList>
        </div>
    )
}

WordTimeline.propTypes = {
    projects: PropTypes.arrayOf(Object).isRequired
}

export default WordTimeline;

const WordList = props => {
    return (
        <div>

        </div>
    )
}