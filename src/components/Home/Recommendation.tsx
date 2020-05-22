import React, { useCallback, useEffect, useState } from "react";
import "../scss/Recommendation.scss";
import Food from "./Food";
import { PacmanLoader } from "react-spinners";
import { foodListSort } from "./foodListSort";
import getUserNumber from "../getUserNumber";

function getFoodImage(
  foodList: Array<number>,
  setUpdateState: React.Dispatch<React.SetStateAction<Boolean>>
) {
  let imgSrcList: string[] = [];
  for (let i = 0; i < 30; ++i) {
    const imgSrc = `http://localhost:4002/images/${foodList[i]}.png`;
    imgSrcList.push(imgSrc);
  }
  return imgSrcList.map((src: string, index: number) => (
    <Food
      key={src}
      imageSrc={src}
      foodNumber={foodList[index]}
      setUpdateState={setUpdateState}
    />
  ));
}

const init = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

function fetchPreference(userNumber: number): Promise<DataType> {
  return new Promise((resolve, reject) => {
    fetch("/userData/preference/all", {
      ...init,
      body: JSON.stringify({ userNumber }),
    })
      .then((req) => req.json())
      .then((data: DataType) => resolve(data))
      .catch((err) => reject(err));
  });
}

function fetchLoss(userNumber: number): Promise<number[]> {
  return new Promise((resolve, reject) => {
    fetch("/userData/foodLoss", {
      ...init,
      body: JSON.stringify({ userNumber }),
    })
      .then((req: Response) => req.json())
      .then((data: number[]) => resolve(data))
      .catch((err) => reject(err));
  });
}

type DataType = {
  food_no: number;
  predicted_preference: number;
}[];

function Recommendation() {
  const [foodList, setFoodList] = useState<Array<number>>();
  const [isUpdate, setUpdateState] = useState<Boolean>(true);

  const predictData = useCallback(async (userNumber: number) => {
    const [preference, loss] = await Promise.all([
      fetchPreference(userNumber),
      fetchLoss(userNumber),
    ]);

    const result = preference.map(({ food_no, predicted_preference }) => ({
      food_no,
      result: predicted_preference * loss[food_no],
    }));
    const sorted = foodListSort(result);
    console.log(sorted);
    const predicted: number[] | undefined = foodListSort(result)?.map(
      ({ food_no }) => food_no
    );
    setFoodList(predicted);
  }, []);

  useEffect(() => {
    if (!isUpdate) return;

    const userNumber = getUserNumber();
    if (userNumber !== -1) {
      predictData(userNumber)
        .then(() => setUpdateState(false))
        .catch((err) => console.error(err));
    }
  }, [predictData, isUpdate]);

  return isUpdate ? (
    <div className="loader">
      <PacmanLoader size={20} color={"#646464"} />
    </div>
  ) : (
    <article className="recommendation">
      <h1>이런 음식 어때요? </h1>
      {getFoodImage(foodList!, setUpdateState)}
    </article>
  );
}

export default Recommendation;
