import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { DatasetType } from "../../routes/MyStatistics";
import "./WeekStatistics.scss";

type PropsType = {
  dataset: DatasetType;
  averageIntake: number;
  recommendation: number;
  unit: string;
};

export type DoughnutDataType = {
  labels: string[];
  datasets: DoughnutDatasetType[];
};

export type DoughnutDatasetType = {
  data: number[];
  backgroundColor: string[];
  hoverBackgroundColor: string[];
};

export default function WeekStatistics({
  dataset,
  averageIntake,
  recommendation,
  unit,
}: PropsType) {
  const [intakeDataset, setIntakeDataset] = useState<DoughnutDataType>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // 모자란 경우
    if (averageIntake < recommendation) {
      const lack = Math.round((recommendation - averageIntake) * 100) / 100;
      const data = {
        labels: ["섭취량", "부족량"],
        datasets: [
          {
            data: [averageIntake, lack],
            backgroundColor: [dataset.datasets[0].backgroundColor, "#F6F7FF"],
            hoverBackgroundColor: [
              dataset.datasets[0].backgroundColor,
              "#F6F7FF",
            ],
          },
        ],
      };
      setIntakeDataset(data);
    } else if (averageIntake >= recommendation) {
      const over = Math.round((averageIntake - recommendation) * 100) / 100;
      const data = {
        labels: ["초과량", "섭취량"],
        datasets: [
          {
            data: [over, averageIntake],
            backgroundColor: ["#FF8868", dataset.datasets[0].backgroundColor],
            hoverBackgroundColor: [
              "#FF8868",
              dataset.datasets[0].backgroundColor,
            ],
          },
        ],
      };
      setIntakeDataset(data);
    }
  }, [averageIntake, dataset.datasets, recommendation]);

  return (
    <article id="week-container">
      <div id="chart-container" className="box-wrapper">
        <Bar data={dataset} />
      </div>
      <div id="weekly-analysis" className="box-wrapper">
        <Doughnut data={intakeDataset} />
        <div>
          <p id="recommendation-value">
            {Math.round(recommendation * 10) / 10}
            {unit}
          </p>
          <p id="recommendation-text">권장 섭취량</p>
        </div>
      </div>
    </article>
  );
}
