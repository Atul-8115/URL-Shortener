import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { BeatLoader } from 'react-spinners'
import Error from './error'
import * as Yup from 'yup'
import useFetch from '@/hooks/useFetch'
import { login } from '@/db/apiAuth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UrlState } from '@/context'

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const longLink = searchParams.get("createNew");
  
  const [errors,setErros] = useState([])

  const handleInputChange = (e) => {
    const { name, value} = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  
  const {data, error, loading, fn: fnlogin} = useFetch(login, formData)
  console.log("Printing all information getting from useFetch in login -> ","data -> ",data," error-> ", error," loading-> ", loading)
  const {fetchUser} = UrlState()


  useEffect(() => {
    if(error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}`: ""}`)
      fetchUser();
    }
  }, [data, error])
  const handleLogin = async() => {
    setErros([])
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
           .email("Invalid Email")
           .required("Email is Required"),
        password: Yup.string()
           .min(5,"Password must be at least 5 characters")
           .required("Password is Required"),
      });

      await schema.validate(formData, {abortEarly: false});

      await fnlogin()
    } catch (error) {
      const newErrors = {};

      error?.inner?.forEach((err) => {
        newErrors[err.path] = err.message
      });

      setErros(newErrors);
    }
  }
  return (
    <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>to your account if you already have one</CardDescription>
          {error && <Error message={error.message}/>}
        </CardHeader>
        <CardContent className = 'space-y-2'>
          <div className='space-y-1'>
            <Input 
                 name="email" 
                 type="email"
                 placeholder="Enter Email"
                 onChange={handleInputChange}
            />
            {errors.email && <Error message={errors.email}/>}
          </div>
          <div className='space-y-1'>
            <Input 
                 name="password" 
                 type="password" 
                 placeholder="Enter Password"
                 onChange={handleInputChange}
            />
            {errors.password && <Error message={errors.password}/>}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin}>
            {loading ? <BeatLoader size={10} color='#36d7b7'/> : "Login"}
          </Button>
        </CardFooter>
    </Card>


  )
}

export default Login
