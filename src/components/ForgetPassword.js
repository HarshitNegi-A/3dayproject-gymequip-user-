import React, { useState } from 'react'
import classes from "./ForgetPassword.module.css"
import { useNavigate } from 'react-router-dom'

const ForgetPassword = () => {

    const [enteredEmail,setEnteredEmail]=useState("")
    const [isLoading,setIsLoding]=useState(false)

    const navi=useNavigate()

    const handleButtonClick=()=>{
        setIsLoding(true)
        fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBlfw_vG2INHgn8GY-wcBmvm4mzrVxScNg',{
            method:'POST',
            body:JSON.stringify({
                requestType:"PASSWORD_RESET",
                email:enteredEmail,
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res=>{
            setIsLoding(false)
            if(res.ok){
                return res.json()
            }
            else{
                return res.json().then(data=> {
                    let errorMessage='Email Not Found'
                     throw new Error(errorMessage);
                  });
            }
        }).then(data=>{
            console.log(data)
            navi('/login')
        }).catch(err=>{
            alert(err.message)
        })
    }
  return (
    <div className={classes.main}>
        <div className={classes.inner}>
            <h1>Enter Your Email</h1>
            <input value={enteredEmail} onChange={(e)=>{setEnteredEmail(e.target.value)}} type='text' /><br/>
            {!isLoading && <button onClick={handleButtonClick}>SEND LINK</button>}
            {isLoading && <p>Loading....</p>}
        </div>
    </div>
  )
}

export default ForgetPassword