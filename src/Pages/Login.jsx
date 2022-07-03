import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
export default function Login(props) {
    const navigate = useNavigate()
    const [email, setEmail]= useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState(null)
    const [success, setSuccess] = useState(false)
    const login = (e) =>{
        e.preventDefault()
        console.log(email,password)
        fetch('/userAuth/login', {
            method:'POST',
            credentials: "include",
           
            headers: {
                'content-type': 'application/json'
         },
            body: JSON.stringify({"email":email,"password": password})
        })
        .then((res)=> res.json())
        .then((data) => {
            console.log(data)
            if(data.success===false){
                setErr(data.message)
            }else{
                setSuccess(true)
                props.setUser(data)
                sessionStorage.setItem('user', data)
                setTimeout(()=>{
                navigate('/')
                },1000)
            }
        })
        .catch((err) => {
            console.log('lol',err)
            setErr(err)})

    }
  return (
    <div class="signbox">
      <legend>Login to Dynamic Tables</legend>
        <form >
            
            <input class="span3 w-100" name="email" placeholder="email" type="text" value={email} onChange={e => setEmail(e.target.value)}/><br/> 
            <input class="span w-100" name="password" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}/> <br/> 
            <button class="btn btn-warning" onClick={login}>Login for Dynamic Tables</button>
            <p className='mt-3'>New to Dynamic Tables? <Link to='/signup'>Sign Up!</Link></p>
            {err && <p>{err}</p>}
        </form>
    </div>
  )
}
