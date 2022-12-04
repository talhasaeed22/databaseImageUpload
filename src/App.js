import React, { useState } from 'react'
import axios from 'axios';
const App = () => {
  const [signupCred, setSignupCred] = useState({ email:'testing@gmail.com', password:"123456", })
  const url = 'http://localhost:5000';
  const [ProfileImage, setImage] = useState('')
  const [uploadImage, setUploadImage] = useState()

  const imageOnChange = (e)=>{
    setUploadImage(e.target.files[0])
    console.log(e.target.files[0].type)
  }

  const showImage = async (e) => {
    e.preventDefault();
    const response = await fetch(`${url}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email:signupCred.email, password:signupCred.password}),
    });
    const json = await response.json();
    console.log(json);
    const iimg = json.image;
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array((json.image.data.data)))
    )
    setImage(base64String)
  }

  const signup = async (e)=>{
    const formData = new FormData();
    formData.append('myFile', uploadImage, uploadImage.name)
    formData.append('name', "Talha");
    formData.append('email', 'testing@gmail.com');
    formData.append('password', '123456')
    const response = await axios.post(`${url}/api/auth/signup`, formData)
    const json = await response.json();
    console.log(json);

  }


  return (
    <div style={{display:"flex", flexDirection:'column', gap:'23px'}}>
      This is React Frontend showing the image of users
      <label htmlFor="">Please Select Image</label>
      <input type="file" name="img" id="img" onChange={imageOnChange} />
      <button onClick={signup}>Save Image</button>
      <button onClick={showImage}> show image </button>
      {
        <img src={`data:image/png;base64,${ProfileImage}`} alt="" style={{width:'100px'}} />
      }
    </div>
  )
}

export default App
