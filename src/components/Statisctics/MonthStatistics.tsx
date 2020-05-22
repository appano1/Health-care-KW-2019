import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { DatasetType } from "../../routes/MyStatistics";

type PropsType = {
  dataset: DatasetType;
  monthAverage: number;
  percentage: number;
  unit: string;
};

export default function MonthStatistics({ dataset, monthAverage, percentage, unit }: PropsType) {
  const percentage_remain = 100 - percentage;
  const data = {
    labels: ["상위", "하위"],
    datasets: [
      {
        data: [percentage, percentage_remain],
        backgroundColor: [dataset.datasets[0].backgroundColor, "#F6F7FF"],
        hoverBackgroundColor: [
          dataset.datasets[0].backgroundColor,
          "#F6F7FF",
        ],
      },
    ],
  };

  return (
    <article id="week-container">
      <div id="chart-container" className="box-wrapper">
        <Line data={dataset} />
      </div>
      <div id="weekly-analysis" className="box-wrapper">
        <Doughnut data={data} />
        <div>
          <p id="recommendation-value">
            {Math.round(monthAverage * 100) / 100}
            {unit}
          </p>
          <p id="recommendation-text">월 평균 섭취량</p>
        </div>
        <p className="description-text">영양 섭취량이 상위 {percentage}%입니다.</p>
      </div>
    </article>
  );
}
