import React, { useCallback, useEffect, useState } from "react";
import getUserNumber from "../getUserNumber";
import "../scss/DateAnalytic.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

// 사용자의 영양 권장량을 가져오는 함수
function getNutritionRecommended(): Promise<number[]> {
  const recommendedNutrition: string | null = sessionStorage.getItem(
    "recommended_nutrition"
  );
  const userNumber = getUserNumber();

  return recommendedNutrition === null
    ? new Promise((resolve, reject) => {
        fetch("/userData/nutrition", {
          method: "POST",
          body: JSON.stringify({ userNumber }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            sessionStorage.setItem(
              "recommended_nutrition",
              JSON.stringify(data)
            );
            resolve(Object.values(data));
          })
          .catch((error) => reject(error));
      })
    : new Promise((resolve) =>
        resolve(Object.values(JSON.parse(recommendedNutrition)))
      );
}

// 사용자의 일일 영양 섭취량을 가져오는 함수
function getNutritionIntake(): Promise<number[]> {
  const userNumber = getUserNumber();

  return new Promise((resolve, reject) => {
    fetch("/userData/intake", {
      method: "POST",
      body: JSON.stringify({ userNumber }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const values: number[] = Object.values(data);
        resolve(values.map((v: number) => Math.round(v * 100) / 100.0));
      })
      .catch((err) => reject(err));
  });
}

function DateAnalytic() {
  const [intake, setIntake] = useState<number[]>([]);
  const [ratio, setRatio] = useState<number[]>([]);
  const [isZero, setZeroState] = useState<boolean>(true);
  const history = useHistory();

  const nutritionList = [
    "calorie",
    "carbohydrate",
    "protein",
    "fat",
    "sugar",
    "salt",
    "cholesterol",
    "saturated-fat",
    "trans-fat",
  ];

  const fetchData = useCallback(async () => {
    const [recommendedNutrition, nutritionIntake] = await Promise.all<
      number[],
      number[]
    >([getNutritionRecommended(), getNutritionIntake()]);
    let result = 0;
    nutritionIntake.forEach((v) => (result += v));

    if (result === 0) setZeroState(true);
    else setZeroState(false);

    const _ratio = recommendedNutrition.map((arg, index) =>
      arg !== 0 ? nutritionIntake[index] / arg : 0
    );
    setIntake(nutritionIntake);
    setRatio(_ratio);
  }, []);

  useEffect(() => {
    fetchData().catch((err) => console.error(err));
  }, [fetchData]);

  useEffect(() => {
    const getElementsStyle = (
      nutritionArray: string[]
    ): (CSSStyleDeclaration | null)[] =>
      nutritionArray.map((nutrition) => {
        const htmlElement: HTMLElement | null = document.getElementById(
          nutrition
        );
        return htmlElement === null ? null : htmlElement.style;
      });
    const elementsStyle = getElementsStyle(nutritionList);
    for (let i = 0; i < elementsStyle.length; ++i) {
      if (elementsStyle[i] !== null)
        (elementsStyle[i] as CSSStyleDeclaration).width =
          (75 * ratio[i]).toString() + "%";
    }
  }, [nutritionList, ratio]);

  return (
    <>
      {isZero && (
        <article className="analytic">
          <div className="goto-page-wrapper">
            <p>아직 음식을 등록하지 않았어요.</p>
            <div>
              <FontAwesomeIcon
                icon={faArrowRight}
                size="2x"
                onClick={() => history.push("register")}
              />
            </div>
          </div>
        </article>
      )}
      {!isZero && (
        <article className="analytic">
          <ul className="nutrition">
            <li>열량</li>
            <li>탄수화물</li>
            <li>단백질</li>
            <li>지방</li>
            <li>당류</li>
            <li>나트륨</li>
            <li>콜레스테롤</li>
            <li>포화지방산</li>
            <li>트랜스지방산</li>
          </ul>

          <ul className="nutrition-graph">
            <li>
              <div id="calorie" />
              {intake[0]}kcal
            </li>
            <li>
              <div id="carbohydrate" />
              {intake[1]}g
            </li>
            <li>
              <div id="protein" />
              {intake[2]}g
            </li>
            <li>
              <div id="fat" />
              {intake[3]}g
            </li>
            <li>
              <div id="sugar" />
              {intake[4]}g
            </li>
            <li>
              <div id="salt" />
              {intake[5]}mg
            </li>
            <li>
              <div id="cholesterol" />
              {intake[6]}mg
            </li>
            <li>
              <div id="saturated-fat" />
              {intake[7]}g
            </li>
            <li>
              <div id="trans-fat" />
              {intake[8]}g
            </li>
            <div className="recommended-amount" />
          </ul>
        </article>
      )}
    </>
  );
}

export default DateAnalytic;
