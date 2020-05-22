import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import getFoodName from "../getFoodName";
import Autocom from "./Autocom";
import "./scss/AnalysisResultList.scss";
import ListItem from "./ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import getUserNumber from "../getUserNumber";

type PropsType = {
  result: { label: string | number }[];
};

enum Food {
  bab = 21,
  gaeranmali = 241,
  melchi = 282,
  dufu = 295,
  kongnamul = 332,
  musengchae = 345,
  kimchi = 516,
  sigumchi = 517,
}

type FoodInfoType = {
  foodNumber: number | null;
  foodName: string;
};

function resultLabelConverter(
  foodInfoList: { label: string | number }[]
): FoodInfoType[] {
  if (foodInfoList.length === 0) return [];
  return foodInfoList.map(({ label }) => {
    const foodNumber =
      typeof label === "number"
        ? label
        : // else "string"
        Object.values(Food).includes(label)
        ? Food[label as keyof typeof Food]
        : -1;

    if (foodNumber === -1) throw new Error("Unhandled food number error");

    return {
      foodNumber,
      foodName: "",
    };
  });
}

function AnalysisResultList({ result }: PropsType) {
  let history = useHistory();
  const [foodInfo, modifyFoodInfo] = useState<FoodInfoType[]>(
    resultLabelConverter(result)
  );

  const [isFoodInsert, setFoodInsertState] = useState<Boolean>(false);

  const convertLabel = useCallback((list: FoodInfoType[]): Promise<
    FoodInfoType
  >[] => {
    if (list.length === 0) return [];
    return list.map(
      async (foodInfo): Promise<FoodInfoType> => {
        const { foodNumber } = foodInfo;
        try {
          return {
            ...foodInfo,
            foodName: await getFoodName(foodNumber!),
          };
        } catch (err) {
          throw new Error(`Unhandled food name error: ${err}`);
        }
      }
    );
  }, []);

  useEffect(() => {
    const _foodInfo = resultLabelConverter(result);
    const converted = Promise.all(convertLabel(_foodInfo));

    converted.then((res: FoodInfoType[]) => modifyFoodInfo(res));
  }, [convertLabel, result]);

  const removeItem = useCallback(
    (itemIndex: number) => {
      modifyFoodInfo(foodInfo.filter((info, index) => itemIndex !== index));
    },
    [foodInfo]
  );

  const onClick = useCallback(() => {
    if (foodInfo.length === 0) return;
    const userNumber = getUserNumber();
    const eaten = {
      userNumber,
      eaten: foodInfo.map(({ foodNumber }) => foodNumber),
    };

    fetch("/food/submit", {
      method: "POST",
      body: JSON.stringify(eaten),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    history.push("/");
  }, [foodInfo, history]);

  return (
    <div id="list-wrapper">
      <Autocom
        foodInfo={foodInfo}
        modifyFoodInfo={modifyFoodInfo}
        setFoodInsertState={setFoodInsertState}
      />
      <div id="list-box">
        <ul>
          {foodInfo.length === 0 ? (
            <p>음식이 아닙니다.</p>
          ) : (
            foodInfo.map(({ foodName }, index) => (
              <ListItem
                key={index}
                index={index}
                foodInsertState={[isFoodInsert, setFoodInsertState]}
                foodName={foodName}
                onRemove={removeItem}
              />
            ))
          )}
        </ul>
      </div>
      <FontAwesomeIcon icon={faArrowRight} size="2x" onClick={onClick} />
    </div>
  );
}

export default AnalysisResultList;
