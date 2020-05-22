import React, { useState, useEffect } from "react";
import Picture from "./Picture";
import getFoodName from "./getFoodName";
import Button from '@material-ui/core/Button';


function number() {
  const Max = 517;
  return Math.round(Math.random(0, Max) * Max);
}

function Random({history}) {
  const [num, setNum] = useState(number());
  const [foodName, setFoodName] = useState();
  const [score, setScore] = useState(5);


  useEffect(() => {
    getFoodName(num).then((res) => setFoodName(res));
  }, [num]);
  useEffect(() =>{
    console.log(score);
  },[score])
  const onClick = () => {
    setNum(number());
  };
  const submit=()=>{
    fetch("/evaluate", {
      method: "POST",
      body: JSON.stringify({ userNumber : sessionStorage.getItem('number'), foodNumber: num, score:score}),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => res.json())
    .then((data) => {
      setNum(number());
    })
  }
  
  return (
    <div id="box">
      <br/>
      <h3>2.이 음식을 좋아하시나요?</h3>
      <br/>
      <span id="foodname">-{foodName}</span>
      <Picture number={num} setScore={setScore} score={score} />
      <Button id="change" onClick={onClick}>
        다른 음식
      </Button>
      <Button id="next" onClick={submit}>
        점수 매기기
      </Button>
      <Button
        id="next"
        onClick={() => {
          alert('환영합니다, 로그인 후 이용해주세요');
          history.push("/");
        }}>
      제출하고 마치기
      </Button>
    </div>
  );
}

export default Random;
