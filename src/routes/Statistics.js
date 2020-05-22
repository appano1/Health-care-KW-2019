import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Bar } from "react-chartjs-2";
import { Helmet } from "react-helmet";
import getUserNumber from "../components/getUserNumber";
import "./Statistics.scss";
import { isNull } from "util";

function Statistics(props) {
  const user_no = getUserNumber();
  const user_name = JSON.parse(sessionStorage.getItem("info"))[0].user_name;
  const [states, setStates] = useState([]);
  const [monthStates, setMonthStates] = useState([]);
  const [averages, setAverages] = useState([]);
  const [allUser, setAllUser] = useState([]);
  let button = 0;

  let nutri = [
    "열량",
    "탄수화물",
    "단백질",
    "지방",
    "당류",
    "나트륨",
    "콜레스테롤",
    "포화지방산",
    "트랜스지방산",
  ];
  //권장 영양성분 recommends 배열에 push
  const recommends = [];
  const recommends_arr = [
    "권장열량",
    "권장탄수화물",
    "권장단백질",
    "권장지방",
    "권장당류",
    "권장나트륨",
    "권장콜레스테롤",
    "권장포화지방산",
    "권장트랜스지방산",
  ];
  const back_color = [
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
  const unit = ["kcal", "g", "g", "g", "g", "mg", "mg", "g", "g"];
  for (let i = 0; i < 9; i++) {
    recommends.push(
      JSON.parse(sessionStorage.getItem("info"))[0][recommends_arr[i]]
    );
  }

  useEffect(() => {
    if (user_no !== -1) {
      fetch("/userData/intake_week", {
        method: "POST",
        body: JSON.stringify({ userNumber: user_no }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        //data에 2차원 배열로 data[0]에는 주간 data, data[1]에는 월간 data, data[2]에는 전체 사용자 데이터
        .then((data) => {
          //빈 날짜 수 num에 저장
          var num = 0;
          for (let i = 0; i < 7; i++) {
            if (data[0][i].열량 === 0) num++;
          }
          //averages에 각 평균들 배열로 push
          var arr = [];

          for (let i = 0; i < 9; i++) {
            if (num === 7) arr.push(0);
            else
              arr.push(
                (
                  (data[0][6][nutri[i]] +
                    data[0][5][nutri[i]] +
                    data[0][4][nutri[i]] +
                    data[0][3][nutri[i]] +
                    data[0][2][nutri[i]] +
                    data[0][1][nutri[i]] +
                    data[0][0][nutri[i]]) /
                  (7 - num)
                ).toFixed(2)
              );
          }
          setAverages(arr);

          //states에 차트 데이터 배열로 push
          var nutrition = [];
          for (let i = 0; i < 9; i++) {
            nutrition.push({
              labels: [
                data[0][6].날짜,
                data[0][5].날짜,
                data[0][4].날짜,
                data[0][3].날짜,
                data[0][2].날짜,
                data[0][1].날짜,
                data[0][0].날짜,
              ],
              datasets: [
                {
                  label: nutri[i],
                  backgroundColor: back_color[i],
                  borderWidth: 2,
                  data: [
                    data[0][6][nutri[i]],
                    data[0][5][nutri[i]],
                    data[0][4][nutri[i]],
                    data[0][3][nutri[i]],
                    data[0][2][nutri[i]],
                    data[0][1][nutri[i]],
                    data[0][0][nutri[i]],
                  ],
                },
              ],
            });
          }
          setStates(nutrition);

          //monthStates에 차트 데이터 배열로 push

          var month = new Date().getMonth() + 1;
          nutrition = [];
          var myLabel = [];
          console.log(data);
          for (let i = 0; i < data[1].length; i++) {
            myLabel.push(month + "월 " + data[1][i].주차 + "주차");
          }
          for (let i = 0; i < 9; i++) {
            var myData = [];
            for (let j = 0; j < data[1].length; j++) {
              myData.push(data[1][j][nutri[i]]);
            }
            nutrition.push({
              labels: myLabel,
              datasets: [
                {
                  label: nutri[i],
                  backgroundColor: back_color[i],
                  borderWidth: 2,
                  data: myData,
                },
              ],
            });
          }
          setMonthStates(nutrition);

          setAllUser(data[2]);
        });
    }
  }, []);

  //=================== 주간 / 월간 버튼 클릭 이벤트 =====================
  let click = (e) => {
    switch (e.target.value) {
      case "주간": {
        document.getElementById("label1").style.backgroundColor = "#454a60";
        document.getElementById("label1").style.color = "#fff";

        for (let i = 0; i < states.length; i++) {
          document.getElementsByClassName("주간")[i].style.display = "inline";
        }
        for (let i = 0; i < monthStates.length; i++) {
          document.getElementsByClassName("월간")[i].style.display = "none";
        }

        button = 0;

        document.getElementById("title_month").style.display = "none";
        break;
      }
      case "월간": {
        document.getElementById("label1").style.backgroundColor = "#fff";
        document.getElementById("label1").style.color = "#454a60";

        for (let i = 0; i < states.length; i++) {
          document.getElementsByClassName("주간")[i].style.display = "none";
        }
        for (let i = 0; i < monthStates.length; i++) {
          document.getElementsByClassName("월간")[i].style.display = "inline";
        }

        button = 1;
        break;
      }
      default:
        console.error("Unexpected error");
        break;
    }
  };
  //===============================================================
  console.log(allUser);
  //======================통계 페이지 오른쪽 파트==========================
  let dif_a = 0;
  let a = [];
  let b = [];
  let ranking = [];
  let ranking_percent = [];

  for (let i = 0; i < 9; i++) {
    //nutri[i]에 해당하는 영양성분 모든 유저들꺼를 다 가져와서 all_user 배열에 push
    var all_user = [];
    for (let userNo = 0; userNo < allUser.length; userNo++) {
      all_user.push(allUser[userNo][nutri[i]]);
    }
    //ranking 배열에 해당하는 영양성분 순위 차례로 저장
    var sorted = all_user.slice().sort(function (a, b) {
      return b - a;
    });
    var ranks = all_user.slice().map(function (v) {
      return sorted.indexOf(v) + 1;
    });
    ranking.push(ranks[user_no]);
    ranking_percent.push(
      Math.round((100 / all_user.length) * (ranking[i] - 1))
    );
    dif_a = (averages[i] - recommends[i]).toFixed(2);
    var wid_a = (averages[i] / recommends[i]) * 400;

    //섭취한 평균이 더 낮을 경우 ==> 권장량 충족 못한 경우
    if (dif_a < 0) {
      a.push(
        <div>
          <div
            style={{ position: "relative", left: 80 + "px", height: "auto" }}
          >
            <a style={{ fontSize: 20 + "px", marginLeft: 290 + "px" }}>
              권장량
            </a>
          </div>
          <div
            style={{
              backgroundColor: back_color[i],
              position: "relative",
              zIndex: 2,
              height: 30 + "px",
              width: wid_a + "px",
            }}
          ></div>
          <div
            style={{
              backgroundColor: "#D0D3D4",
              position: "relative",
              bottom: 30 + "px",
              zIndex: 1,
              height: 30 + "px",
            }}
          ></div>
          <div
            style={{ position: "relative", bottom: 40 + "px", height: "auto" }}
          >
            <a style={{ fontSize: 20 + "px" }}>0{unit[i]}</a>
            <a
              style={{
                fontSize: 20 + "px",
                marginLeft: 370 - unit[i].length * 15 + "px",
              }}
            >
              {recommends[i].toFixed() + unit[i]}
            </a>
          </div>
          <div
            style={{
              position: "relative",
              bottom: 35 + "px",
              height: "auto",
              fontSize: 20 + "px",
            }}
          >
            <a>
              평균 섭취량 : {averages[i]}
              {unit[i]}
            </a>
          </div>
          <div
            style={{
              position: "relative",
              bottom: 20 + "px",
              fontSize: 25 + "px",
              height: "auto",
            }}
          >
            <a>
              {Math.abs(dif_a)}
              {unit[i]} 부족해요!
            </a>
          </div>
        </div>
      );
    } else {
      wid_a = 400;
      a.push(
        <div>
          <div
            style={{ position: "relative", left: 80 + "px", height: "auto" }}
          >
            <a style={{ fontSize: 20 + "px", marginLeft: 290 + "px" }}>
              권장량
            </a>
          </div>
          <div
            style={{
              backgroundColor: back_color[i],
              position: "relative",
              zIndex: 2,
              height: 30 + "px",
              width: wid_a + "px",
            }}
          ></div>
          <div
            style={{
              backgroundColor: "#D0D3D4",
              position: "relative",
              bottom: 30 + "px",
              zIndex: 1,
              height: 30 + "px",
            }}
          ></div>
          <div
            style={{ position: "relative", bottom: 40 + "px", height: "auto" }}
          >
            <a style={{ fontSize: 20 + "px" }}>0{unit[i]}</a>
            <a
              style={{
                fontSize: 20 + "px",
                marginLeft: 370 - unit[i].length * 15 + "px",
              }}
            >
              {recommends[i].toFixed() + unit[i]}
            </a>
          </div>
          <div
            style={{
              position: "relative",
              bottom: 40 + "px",
              height: "auto",
              fontSize: 20 + "px",
            }}
          >
            <a>
              평균 섭취량 : {averages[i]}
              {unit[i]}
            </a>
          </div>
          <div
            style={{
              position: "relative",
              bottom: 30 + "px",
              fontSize: 25 + "px",
              height: "auto",
            }}
          >
            <a>
              {Math.abs(dif_a)}
              {unit[i]} 초과됐어요!
            </a>
          </div>
        </div>
      );
    }

    var arrow_height = (140 * (100 - ranking_percent[i])) / 100;

    b.push(
      <div>
        <img
          src="/images/pyramid.png"
          width="150"
          height="150"
          alt="피라미드"
        />
        <div style={{ display: "inline" }}>
          <img
            src="/images/left.png"
            width="20"
            height="20"
            style={{ marginBottom: arrow_height }}
            alt="왼쪽화살표"
          />
          <img
            src="/images/penguin.png"
            width="25"
            height="25"
            style={{ marginBottom: arrow_height }}
            alt="펭귄이미지"
          />
          {/* <a style={{marginLeft:"40px",color:"#999999"}}>{ranking[i]}</a>
              <a>위</a> */}
          <a style={{ fontSize: "25px" }}>
            상위 <a style={{ color: "blue" }}>{ranking_percent[i]}</a>%
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="statistics">
        <section className="statistics-container">
          <div className="select-button">
            <div class="radio-items">
              <div class="col-6">
                <input
                  id="a1"
                  class="only-sr checked"
                  type="radio"
                  name="temp1"
                  value="주간"
                  onChange={click}
                />
                <label for="a1" id="label1">
                  주간
                </label>
              </div>
              <div class="col-6">
                <input
                  id="a2"
                  class="only-sr"
                  type="radio"
                  name="temp1"
                  value="월간"
                  onChange={click}
                />
                <label for="a2">월간</label>
              </div>
            </div>
          </div>

          {states.map((value, index) => {
            return (
              <div className="주간">
                <Bar
                  id={index}
                  data={states[index]}
                  width={800}
                  height={250}
                  options={{
                    responsive: false,
                    legend: {
                      display: true,
                      position: "top",
                      labels: {
                        fontSize: 20,
                      },
                    },
                    scales: {
                      yAxes: [
                        {
                          gridLines: {
                            drawBorder: false,
                          },
                          ticks: {
                            display: true,
                            min: 0,
                          },
                        },
                      ],
                    },
                  }}
                />
                <Helmet>
                  <script>
                    document.getElementsByTagName('canvas')[0].style.display="inline";
                    document.getElementsByTagName('canvas')[1].style.display="inline";
                    document.getElementsByTagName('canvas')[2].style.display="inline";
                    document.getElementsByTagName('canvas')[3].style.display="inline";
                    document.getElementsByTagName('canvas')[4].style.display="inline";
                    document.getElementsByTagName('canvas')[5].style.display="inline";
                    document.getElementsByTagName('canvas')[6].style.display="inline";
                    document.getElementsByTagName('canvas')[7].style.display="inline";
                    document.getElementsByTagName('canvas')[8].style.display="inline";
                  </script>
                </Helmet>
                <div className="week_statistics">
                  <a style={{ fontSize: 30 }}>{a[index]}</a>
                </div>
              </div>
            );
          })}

          {/* ----------------------월간------------------------- */}

          {monthStates.map((value, index) => {
            return (
              <div className="월간" style={{ display: "none" }}>
                <Bar
                  id={index}
                  data={monthStates[index]}
                  width={800}
                  height={250}
                  options={{
                    responsive: false,
                    legend: {
                      display: true,
                      position: "top",
                      labels: {
                        fontSize: 20,
                      },
                    },
                    scales: {
                      xAxes: [
                        {
                          ticks: {
                            fontSize: 20,
                          },
                        },
                      ],
                      yAxes: [
                        {
                          gridLines: {
                            drawBorder: false,
                          },
                          ticks: {
                            display: true,
                            min: 0,
                          },
                        },
                      ],
                    },
                  }}
                />
                <Helmet>
                  <script>
                    document.getElementsByTagName('canvas')[9].style.display="inline";
                    document.getElementsByTagName('canvas')[10].style.display="inline";
                    document.getElementsByTagName('canvas')[11].style.display="inline";
                    document.getElementsByTagName('canvas')[12].style.display="inline";
                    document.getElementsByTagName('canvas')[13].style.display="inline";
                    document.getElementsByTagName('canvas')[14].style.display="inline";
                    document.getElementsByTagName('canvas')[15].style.display="inline";
                    document.getElementsByTagName('canvas')[16].style.display="inline";
                    document.getElementsByTagName('canvas')[17].style.display="inline";
                  </script>
                </Helmet>
                <div className="week_statistics">
                  <a style={{ fontSize: 30 }}>{b[index]}</a>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
}

export default Statistics;
