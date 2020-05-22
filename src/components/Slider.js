import React, {useEffect} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const marks = [
  {
    value: 0,
    label: "0"
  },
  {
    value: 5,
    label: "5"
  },
  {
    value: 10,
    label: "10"
  }
];
export default function DiscreteSlider({setScore}) {
    
    
    return (
      <div className="slider">
        <Typography id="discrete-slider-custom" gutterBottom>
          점수를 매겨주세요
        </Typography>
        <Slider
          defaultValue={5}
          aria-labelledby="discrete-slider-custom"
          step={1}
          max={10}
          min={0}
          valueLabelDisplay="auto"
          marks={marks}
          color='primary'
          onChangeCommitted={(e, value) => {
            setScore(value);
          }}
        />
      </div>
    );
  }
  