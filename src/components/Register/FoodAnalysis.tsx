import React from "react";
import "./scss/FoodAnalysis.scss";
import { CircleLoader } from "react-spinners";
import AnalysisResultList from "./AnalysisResultList";
import {State} from "./FileUpload";

type PropsType = {
  result: {
    label: string
  }[],
  state: State
};

function FoodAnalysis({ result, state }: PropsType) {
  return (
    <div id="prediction-list">
      {state === State.LOADING
        ? (
          <div id="loader-box">
            <CircleLoader />
          </div>
        )
        : state === State.SUCCESS ? <AnalysisResultList result={result} /> : null
      }
    </div>
  );
}

export default FoodAnalysis;
