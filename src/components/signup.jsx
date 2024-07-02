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
import { signup } from '@/db/apiAuth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UrlState } from '@/context'

const Signup = () => {
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    password: "",
    prifle_pic: null,
  })

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors,setErros] = useState([])

  const handleInputChange = (e) => {
    const { name, value, files} = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: files? files[0] : value,
    }));
  }
  
  // console.log("Printing signup -> ",signup)
  // const response = useFetch(signup, formData)
  const {data, loading = true, error, fn: fnSignup} = useFetch(signup, formData)
  // console.log("Printing response from useFetch hook -> ",response)
  const {fetchUser} = UrlState()


  useEffect(() => {
    if(error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}`: ""}`)
      fetchUser();
    }
  }, [error, loading])

  const handleSignup = async() => {
    setErros([])
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
           .email("Invalid Email")
           .required("Email is Required"),
        password: Yup.string()
           .min(5,"Password must be at least 5 characters")
           .required("Password is Required"),
        prifle_pic: Yup.mixed().required("Profile picture is required"),
      });

      await schema.validate(formData, {abortEarly: false});

      const response = await fnSignup()
      console.log("Printing response getting from fnSignup -> ",response)
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
          <CardTitle>Signup</CardTitle>
          <CardDescription>Create a new account if you haven&rsquo;t already</CardDescription>
          {error && <Error message={error.message}/>}
        </CardHeader>
        <CardContent className = 'space-y-2'>
          <div className='space-y-1'>
            <Input 
                 name="name" 
                 type="text"
                 placeholder="Enter Your Name"
                 onChange={handleInputChange}
            />
            {errors.name && <Error message={errors.name}/>}
          </div>
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
          <div className='space-y-1'>
            <Input 
                 name="profile_pic" 
                 type="file" 
                 accept="image/*"
                 onChange={handleInputChange}
            />
            {errors.prifle_pic && <Error message={errors.profile_pic }/>}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignup}>
            {loading ? <BeatLoader size={10} color='#36d7b7'/> : "Create Account"}
          </Button>
        </CardFooter>
    </Card>


  )
}

export default Signup
