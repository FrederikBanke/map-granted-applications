import React from 'react'
import PropTypes from 'prop-types'
import Graph from "react-graph-network";

const CooccurrenceMap = props => {

    const containerStyle = {
        width: "100%",
        height: "400px",
        backgroundColor: "#a1a1a1"
    }

    const data = {
        nodes: [
            { id: "innovation", weight: 20 },
            { id: "nano", weight: 10 },
            { id: "neuron", weight: 16 },
            { id: "neuronal", weight: 6 },
            { id: "synapse", weight: 12 },
            { id: "smes", weight: 7 },
        ],
        links: [
            { "source": "innovation", "target": "nano", weight: 2 },
            { "source": "innovation", "target": "synapse", weight: 4 },
            { "source": "nano", "target": "neuronal", weight: 8 },
            { "source": "nano", "target": "neuron", weight: 2 },
            { "source": "nano", "target": "synapse", weight: 2 },
            { "source": "smes", "target": "synapse", weight: 2 },
        ]
    };



    const Line = ({ link, ...restProps }) => {
        return (
            <line
                {...restProps}
                stroke={"blue"}
                strokeWidth={link.weight}
            />
        )
    };

    const fontSize = 14;
    const radius = 10;

    const Node = ({ node }) => {
        // colors
        // const familyMatch = node.family.match(/Tolst|Trubetsk|Volkonsk|Gorchakov/);
        // const stroke = colorSwitch(familyMatch);
        const stroke = "blue"


        // sizes
        const sizes = {
            radius: node.weight,
            textSize: fontSize,
            textX: radius * 1.5,
            textY: radius / 2,
        };


        return (
            <>
                <circle
                    fill={`light${stroke}`}
                    stroke={stroke}
                    r={sizes.radius}
                />
                <g style={{ fontSize: sizes.textSize + 'px' }}>
                    <text
                        x={sizes.radius + 7}
                        y={sizes.radius / 2}
                    >
                        {node.id}
                    </text>
                </g>

            </>
        );
    };

    return (
        <div style={containerStyle}>
            <Graph
                data={data}
                NodeComponent={Node}
                LineComponent={Line}
                nodeDistance={300}
                zoomDepth={3}
                hoverOpacity={0.3}
                enableDrag={true}
                pullIn={true}
            />
        </div>
    )
}

CooccurrenceMap.propTypes = {
    wordWeights: PropTypes.object,
    cooccurrenceMatrix: PropTypes.array

}

export default CooccurrenceMap
