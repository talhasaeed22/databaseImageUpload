import React, { useState } from 'react'

const App = () => {
  const [signupCred, setSignupCred] = useState({ email:'hamza@gmail.com', password:"123456", })
  const url = 'http://localhost:5000';
  const [ProfileImage, setImage] = useState('')

  const showImage = async (e) => {
    e.preventDefault();
    const response = await fetch(`${url}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email:signupCred.email, password:signupCred.password})
    });
    const json = await response.json();
    console.log(json);
    const iimg = json.image;
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array((json.image.data.data)))
    )
    setImage(base64String)
  }
  return (
    <div>
      This is React Frontend showing the image of users
      <button onClick={showImage}> show image </button>
      {
        <img src={`data:image/png;base64,${ProfileImage}`} alt="" style={{width:'100px'}} />
      }
    </div>
  )
}

export default App
