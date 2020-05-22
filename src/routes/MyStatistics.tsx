import React, { useEffect, useReducer, useCallback, useRef } from "react";
import getUserNumber from "../components/getUserNumber";
import moment from "moment";
import WeekStatistics from "../components/Statisctics/WeekStatistics";
import Header from "../components/Header";
import { useHistory } from "react-router-dom";
import "./MyStatistics.scss";
import MonthStatistics from "../components/Statisctics/MonthStatistics";

const ONE_WEEK = 7;
const NUTRITION_COUNT = 9;

const backgroundColor = [
  "#FFFFCC",
  "#AFF8DB",
  "#FFABAB",
  "#85E3FF",
  "#97A2FF",
  "#FFFFD1",
  "#F6A6FF",
  "#C4FAF8",
  "#FFCBC1",
];

interface DataType {
  나트륨: number;
  단백질: number;
  당류: number;
  열량: number;
  지방: number;
  콜레스테롤: number;
  탄수화물: number;
  트랜스지방산: number;
  포화지방산: number;
}

interface DayDataType extends DataType {
  날짜: string;
}

interface WeekDateType extends DataType {
  주차: number;
}

type FetchingDataType = [DayDataType[], WeekDateType[], DataType[]];

function getNutritionAverage(list: DayDataType[]): number[] {
  let average = Array<number>(NUTRITION_COUNT).fill(0);
  let notInputed = 0;
  list.forEach((elements) => {
    const values = Object.values(elements);
    const data: number[] = values.slice(1, values.length);

    if (data[0] === 0) ++notInputed;
    data.forEach((element, index) => {
      average[index] += element;
    });
  });
  return average.map(
    (element) => Math.round((element / (ONE_WEEK - notInputed)) * 100) / 100
  );
}

function nutritionGrouping(list: DataType[]) {
  let group: Array<number[]> = Array.from(Array(NUTRITION_COUNT), () => []);
  list.forEach((elems) => {
    const values = Object.values(elems);
    values.forEach((value, index) => {
      group[index].push(value);
    });
  });
  return group;
}

function grouping<T extends DataType>(
  list: T[]
): [(string | number)[], Array<number[]>] {
  let group: Array<number[]> = Array.from(Array(NUTRITION_COUNT), () => []);
  let diff: (string | number)[] = [];
  list.forEach((elems) => {
    const values = Object.values(elems);
    values.forEach((value, index) => {
      if (index === 0) {
        diff.push(value);
        return;
      }
      group[index - 1].push(value);
    });
  });
  return [diff, group];
}

function makeWeekDataset(list: DayDataType[]) {
  const [date, nutritionIntake] = grouping(list) as [string[], Array<number[]>];
  const nutritions = Object.keys(list[0]).slice(1, NUTRITION_COUNT + 1);

  let dataset = [];
  for (let i = 0; i < NUTRITION_COUNT; ++i) {
    dataset.push({
      labels: date.reverse(),
      datasets: [
        {
          label: nutritions[i],
          backgroundColor: backgroundColor[i],
          borderWidth: 2,
          data: [...nutritionIntake[i].reverse()],
        },
      ],
    });
  }
  console.log(dataset);
  return dataset;
}

function makeMonthDataset(list: WeekDateType[]) {
  const [week, weekIntake] = grouping(list) as [number[], Array<number[]>];
  const month = moment().month() + 1;
  const label = week.map((elem) => `${month}월 ${elem}주차`);
  const nutritions = Object.keys(list[0]).slice(1, NUTRITION_COUNT + 1);

  let dataset = [];
  for (let i = 0; i < NUTRITION_COUNT; ++i) {
    dataset.push({
      labels: label,
      datasets: [
        {
          label: nutritions[i],
          fill: false,
          backgroundColor: backgroundColor[i],
          borderWidth: 3,
          borderColor: backgroundColor[i],
          data: [...weekIntake[i]],
        },
      ],
    });
  }
  console.log(dataset);
  return dataset;
}

export type DatasetType = {
  labels: (string | number)[];
  datasets: {
    label: string;
    backgroundColor: string;
    borderWidth: number;
    data: number[];
  }[];
};

type State = {
  weeklyIntakeAverage: number[];
  weekDataset: DatasetType[];
  monthDataset: DatasetType[];
  usersDataset: DataType[];
  myPercentage: number[];
  monthAverageIntake: number[];
  isWeek: boolean;
};

type Action =
  | {
      type: "SET_AVERAGE";
      averageList: number[];
    }
  | {
      type: "SET_WEEK_DATASET";
      dataset: DatasetType[];
    }
  | {
      type: "SET_MONTH_DATASET";
      dataset: DatasetType[];
    }
  | {
      type: "TOOGLE_STATE";
      state: boolean;
    }
  | {
      type: "SET_ALL_USER_DATASET";
      dataset: DataType[];
    }
  | {
      type: "SET_MY_PERCENTAGE";
      percentageList: number[];
    }
  | {
      type: "SET_MONTH_AVERAGE_INTAKE";
      monthAverageList: number[];
    };

interface RecommendationType {
  권장나트륨: number;
  권장단백질: number;
  권장당류: number;
  권장열량: number;
  권장지방: number;
  권장콜레스테롤: number;
  권장탄수화물: number;
  권장트랜스지방산: number;
  권장포화지방산: number;
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "SET_AVERAGE":
      return {
        ...state,
        weeklyIntakeAverage: action.averageList,
      };
    case "SET_MONTH_DATASET":
      return {
        ...state,
        monthDataset: action.dataset,
      };
    case "SET_WEEK_DATASET":
      return {
        ...state,
        weekDataset: action.dataset,
      };
    case "TOOGLE_STATE":
      return {
        ...state,
        isWeek: action.state,
      };
    case "SET_ALL_USER_DATASET":
      return {
        ...state,
        usersDataset: action.dataset,
      };
    case "SET_MY_PERCENTAGE":
      return {
        ...state,
        myPercentage: action.percentageList,
      };
    case "SET_MONTH_AVERAGE_INTAKE":
      return {
        ...state,
        monthAverageIntake: action.monthAverageList,
      };
    default:
      throw new Error("Unhandled error");
  }
}

const unit = ["kcal", "g", "g", "g", "g", "mg", "mg", "g", "g"];

export default function MyStatistics() {
  const userNumber = getUserNumber();
  const [state, dispatch] = useReducer(reducer, {
    weeklyIntakeAverage: [],
    weekDataset: [],
    monthDataset: [],
    usersDataset: [],
    myPercentage: [],
    monthAverageIntake: [],
    isWeek: true,
  });
  const history = useHistory();

  if (sessionStorage.getItem("recommended_nutrition") === null) {
    history.push("/");
  }
  const recommendation: RecommendationType = JSON.parse(
    sessionStorage.getItem("recommended_nutrition")!
  );
  let recommendationValue: number[] = Object.values(recommendation);
  for (let i = 1; i <= 3; i++) {
    recommendationValue[recommendationValue.length - i] = 0;
  }

  useEffect(() => {
    fetch("/userData/intake_week", {
      method: "POST",
      body: JSON.stringify({ userNumber }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: FetchingDataType) => {
        dispatch({
          type: "SET_AVERAGE",
          averageList: getNutritionAverage(data[0]),
        });
        dispatch({
          type: "SET_WEEK_DATASET",
          dataset: makeWeekDataset(data[0]),
        });
        dispatch({
          type: "SET_MONTH_DATASET",
          dataset: makeMonthDataset(data[1]),
        });
        dispatch({
          type: "SET_ALL_USER_DATASET",
          dataset: data[2],
        });
      });
  }, [userNumber]);

  useEffect(() => {
    const usersDataset = state.usersDataset;
    if (usersDataset.length !== 0) {
      const myDataset = usersDataset[userNumber];
      const myValue = Object.values(myDataset);
      dispatch({ type: "SET_MONTH_AVERAGE_INTAKE", monthAverageList: myValue });

      const nutritions = nutritionGrouping(usersDataset);
      nutritions.forEach((elems) => elems.sort((a, b) => b - a));

      const rank = nutritions.map(
        (elems, index) => elems.findIndex((elem) => elem === myValue[index]) + 1
      );
      const percentage = rank.map(
        (item) => Math.round((item / usersDataset.length) * 100 * 100) / 100
      );
      dispatch({ type: "SET_MY_PERCENTAGE", percentageList: percentage });
    }
  }, [state.usersDataset, userNumber]);

  useEffect(() => {
    console.log(state.usersDataset);
  }, [state.usersDataset]);

  const onWeekButtonClick = useCallback(() => {
    dispatch({ type: "TOOGLE_STATE", state: true });
    rightButtonRef.current?.classList.remove("select");
    leftButtonRef.current?.classList.add("select");
  }, []);

  const onMonthButtonClick = useCallback(() => {
    dispatch({ type: "TOOGLE_STATE", state: false });
    rightButtonRef.current?.classList.add("select");
    leftButtonRef.current?.classList.remove("select");
  }, []);

  const leftButtonRef = useRef<HTMLButtonElement>(null);
  const rightButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Header />
      <div id="button-wrapper">
        <button
          className="select-button select left"
          ref={leftButtonRef}
          onClick={onWeekButtonClick}
        >
          주간
        </button>
        <button
          className="select-button right"
          ref={rightButtonRef}
          onClick={onMonthButtonClick}
        >
          월간
        </button>
      </div>
      {state.isWeek &&
        state.weekDataset.map((data, index) => (
          // <h1 key={index}>Hello</h1>
          <WeekStatistics
            key={index}
            dataset={data}
            averageIntake={state.weeklyIntakeAverage[index]}
            recommendation={recommendationValue[index]}
            unit={unit[index]}
          />
        ))}
      {!state.isWeek &&
        state.monthDataset.map((data, index) => (
          <MonthStatistics
            key={index}
            dataset={data}
            monthAverage={state.monthAverageIntake[index]}
            percentage={state.myPercentage[index]}
            unit={unit[index]}
          />
        ))}
    </>
  );
}
