import React, { useState, useCallback, useEffect,useRef } from "react";
import "./scss/SignUp.scss";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function SignUp({ history }) {
  const [inputs, setInputs] = useState({
    name: "",
    address: "",
    password: "",
    age: "",
    sex: "남",
  });
  const { name, address, password, age,sex } = inputs;

  const nameRef=useRef();
  const addressRef=useRef();
  const passwordRef=useRef();
  const ageRef=useRef();
  const buttonRef=useRef();

  const onChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      console.log(value);
      setInputs({
        ...inputs,
        [name]: value,
      });
      if(nameRef.current.value && addressRef.current.value
        && passwordRef.current.value && ageRef.current.value
       ){
        buttonRef.current.style.backgroundColor="#248aff";
      }
    },
    [inputs]
  );

  const isSuccess = () => {
    setInputs({
      name: "",
      address: "",
      password: "",
      age: "",
      sex: "",
    });
  };

  const onClick = () => {
    fetch("/addUser", {
      method: "POST",
      body: JSON.stringify(inputs),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.text);
        if (data.text !== "success") {
          isSuccess();
          history.push("/");
        }
        else{
          sessionStorage.setItem('number',data.user_no);
          history.push("/research");
        }
      });
  };

  useEffect(() => {
    const isLogin = sessionStorage.getItem("isLogin");
    if (isLogin) {
      history.push("/");
    }
  }, [history]);

  return (
      <div className ="signup-page">
          <div className ="signup-container">
          <img src="/images/maet-logo.png" alt="팀 로고" />
          <input
            name="name"
            placeholder="이름"
            onChange={onChange}
            value={name}
            id = "name"
            ref={nameRef}
          />
          <input
            name="address"
            placeholder="아이디"
            onChange={onChange}
            value={address}
            id = "address"
            ref={addressRef}
          />       
          <input
            name="password"
            placeholder="비밀번호"
            onChange={onChange}
            value={password}
            type ="password"
            id = "password"
            ref={passwordRef}
          />
          <input
           name="age" 
           placeholder="나이" 
           onChange={onChange} 
           value={age}
           id = "age"
           ref={ageRef}
            />
        <div className="genderbox">
               <RadioGroup aria-label="gender" id = "gender" name="sex" value={sex} onChange={onChange} >
                 <label>성별  :</label>
                남 <FormControlLabel  id ="sex" value="남"  control={<Radio/>}/>
                여 <FormControlLabel  id ="sex" value="여"  control={<Radio/>}/>
               </RadioGroup>
        </div>
         
      <button ref ={buttonRef} onClick={onClick}>제출</button>
        </div>
      
      </div>
  );
}
export default SignUp;
