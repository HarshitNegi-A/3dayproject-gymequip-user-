import React, { useState } from 'react'
import classes from "./Login.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../store/redux-store'
import { Link, useNavigate } from 'react-router-dom'
import Header from './Header'

const Login = () => {

    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [confirmPassword,setConfirmPassword]=useState('')

    const dispatch=useDispatch()

    const login=useSelector(state=>state.auth.login)

    const navigate=useNavigate()

    const handleButtonClick=()=>{
        dispatch(authActions.changeLogin())
    }
    
    const handleFormSubmit=(e)=>{
        e.preventDefault()
        let url;
        if(login || password===confirmPassword){
            if(login){
                url="https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBlfw_vG2INHgn8GY-wcBmvm4mzrVxScNg"
            }
            else{
                url="https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBlfw_vG2INHgn8GY-wcBmvm4mzrVxScNg"
            }

            fetch(url,{
                method:'POST',
                body:JSON.stringify({
                    email:email,
                    password:password,
                    requestSecureToken:true
                }),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then((res)=>{
                if(res.ok){
                    return res.json();
                }
                else{
                    return res.json.then(data=>{
                        let errorMessage='Authentication failed'
                        throw new Error(errorMessage);
                    });
                }
            }).then(data=>{
                dispatch(authActions.login(data.idToken))
                dispatch(authActions.changeUserId(email))
                localStorage.setItem('userId',email)
                localStorage.setItem('token',data.idToken)
                navigate('/')
            })

        }
        else{
            alert('Password does not match with confirm password')
        }
    }

    return ( <>
        <Link to='/'><h2>GymEquip</h2></Link>
        <div className={classes.main}>
            <h1>{login ? 'Log in' : 'SignUp'}</h1>
            <form onSubmit={handleFormSubmit}>
                <label htmlFor="email">Email:</label>
                <input value={email} onChange={(e)=>{setEmail(e.target.value)}} type="text" required id="email"/><br/><br/>
                <label htmlFor="password">Password:</label>
                <input value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" required id="password"/><br/><br/>
                {!login && <><label htmlFor="cpassword">Confirm Password:</label>
                <input value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}} type="password" required id="cpassword"/><br/><br/></>}
                {login?<button type="submit">Login</button>:<button type="submit">Sign Up</button>}
                
            </form><br/><br/>
            {login && <Link to="/resetPassword"><button className={classes.forget}>Forget Password</button></Link>}
            
            
        </div>
        
        <button onClick={handleButtonClick} className={classes.button} type="click">{login?'Dont have an account?Sign Up':'Have an account?Login'}</button>
        </>
        )
}

export default Login