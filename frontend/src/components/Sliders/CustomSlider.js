import React, { useState } from 'react'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


export default function CustomSlider(props) {
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(1000);
    const [step, setStep] = useState(1);
    const [value, setValue] = useState(50);

    const onInputChange = (event) => {
        let value = parseInt(event.target.value);
        onSliderChange(value);
    }

    const onSliderChange = (value) => {
        if (isNaN(value)) {
            value = 0;
        }
        if (0 <= value && value <= 1000) {
            setValue(value);
            if (props.onChange) {
                props.onChange(value);
            }
        }
    }

    return (
        <div>
            <input type="number" min={min} max={max} onChange={onInputChange} value={value} />closest projects
            <br /><br />
            <Slider value={value} min={min} max={max} step={step}
                onChange={onSliderChange}
            />
        </div>
    );
}