import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorBox from '../Components/ErrorBox'
import {api_base} from '../env'
export default function SignUp() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState(null)
    const [success, setSuccess] = useState(false)
    const signUp = async (e) =>{
        e.preventDefault()
        console.log(email,password,username)
        fetch('/userAuth/signup', {
            method:'POST',
           
           
            headers: {
                'content-type': 'application/json'
         },
            body: JSON.stringify({"username":username,"email":email,"password": password})
        })
        .then((res)=> res.json())
        .then((data) => {
            console.log(data)
            if(data.status===500){
                setErr(data.message)
            }else{
                setSuccess(true)
                setTimeout(()=>{
                navigate('/login')
                },1000)
            }
        })
        .catch((err) => {
            console.log(err)
            setErr(err)})


    }
  return (
    <>
    {err && (<ErrorBox message={'Error Signing Up'}/>)}
    <div class="signbox">
      <legend>New to Dynamic Tables? <br/>Sign up!</legend>
        <form >
            <input class="span3 w-100" name="email" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}/><br/> 
            <input class="span3 w-100" name="username" placeholder="Username" type="text" value={username} onChange={e => setUsername(e.target.value)}/><br/> 
            <input class="span w-100" name="password" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}/> <br/> 
            <button class="btn btn-warning" onClick={signUp}>Sign up for Dynamic Tables</button>
            <p className='mt-3'>Already a member? <Link to='/login'>LogIn!</Link></p>
            {success===true? <p className='text-success'>Sign up successful!</p>:''}
        </form>
    </div>
    </>
  )
}
