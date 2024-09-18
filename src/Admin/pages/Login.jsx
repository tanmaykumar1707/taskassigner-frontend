import React, { useState ,useEffect} from 'react';
import Loader from '../../components/loader/loader';
 import Image from '../assets/4949455_19732 1.png';
 import LogoImage from '../assets/logo_tapvox.png';
 import swipeLogoImage from '../assets/swipedesk.png';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import
//  employeeSlice , 
{ loginemployee,
  //  loademployee
  } from '../../features/employeeSlice';
import { AiFillEye,AiFillEyeInvisible } from 'react-icons/ai'
import { toast } from 'react-hot-toast';
import { Box,Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Select, MenuItem, FormControl, InputLabel, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import {url} from '../../services/api'
import { ThreeDots } from 'react-loader-spinner'

//  login page 

export default function Login() {


  const logoPath = process.env.REACT_APP_NAME==='TAPDESK'? LogoImage : process.env.REACT_APP_NAME==='SWIPEDESK' ?swipeLogoImage : '';

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" ,role:""})
  const [loading, setLoading] = useState(false)

  const employee = useSelector((state) => state.employee);



//   useEffect(() => {
//      window.addEventListener('login', (event) => {
//          console.log('Login component mounted2');
        
//     });

    
// }, []); // Empty dependency array ensures the effect runs only once, when the component mounts



useEffect(() => {
  console.log(sessionStorage);
  console.log(employee);

  if (employee._id) {
    console.log(sessionStorage);
    navigate("/dashboard");
  }
}, [navigate, employee]);
  
useEffect(() => {
      window.scrollTo(0, 0);
  }, [])

  const changeHandler = (e) => {
      setFormData((prevFormData) => {
          return {
              ...prevFormData,
              [e.target.name]: e.target.value
          }
      })
  }


const handleSubmit =async (e) => {
  setLoading(true);
  e.preventDefault();

  if (formData.email.length === 0) {
    toast.error("Enter a valid Email");
    setLoading(false);
    return;
  }
  if (formData.password.length === 0) {
    toast.error("Enter a valid Password");
    setLoading(false);
    return;
  }

  // console.log(formData)

  await dispatch(loginemployee(formData)).then(() => {
    setLoading(false);
  });
  setLoading(false);
};



//
const [open, setOpen] = useState(false);
const [email, setEmail] = useState('');
const [loading2,setLoading2]=useState(false);
const handleClickOpen = () => {
  setOpen(true);
};

const handleClose = (event, reason) => {
  if (reason && reason === "backdropClick") 
    return;
  setOpen(false);
  setEmail('');
  setLoading(false);
};



const handleSendLink = async() => {
  setLoading2(true);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      toast.error("Valid Email Required!");
      setLoading2(false);
       return false;
    }
  
 try{
  const res = await axios.post(`${url}/api/resetPasswordRequest`, {
     email: email,
      });

      if(res.status===200){
        setOpen(false);
        toast.success(`${res?.data?.message}`);
       
      }

  }catch(error){
    toast.error(`Error : ${error?.response?.errorMessage}`)
  }
 

  setLoading2(false)
  
};

  return (
    // <div className="container-fluid flex justify-center items-center h-screen">
    //   {/* Left side */}
    //   <div className="w-1/2">
    //     <img src={Image} alt="" />
    //   </div>

    //   {/* Right side */}
    //   <form onSubmit={handleSubmit} className="form">
    //   <h1 className="text-4xl font-semibold mb-16 text-center" >Login</h1>
    //   <div className="mb-4">  
    //   {/* bg-[#DCCBFD] */}
    //   <select id="role" name="role" className="w-full border border-gray-300 rounded px-3 py-2 " onChange={changeHandler} value={formData.role}>
    //         <option value="">Login As</option>
    //         <option value="admin">Admin</option>
    //         <option value="Account Manager">Account Manager</option>
    //         <option value="NOC Manager">NOC Manager</option>
    //       </select>
    //     </div>
    //     <div className="mb-4">
    //       <input onChange={changeHandler} autoComplete="email" value={formData.email} name="email" type="email" placeholder='Username' className="w-full border border-gray-300 rounded px-3 py-2 placeholder-black "/>
    //     </div>
    //     <div className="mb-4 relative">
    //       <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder="Password" className="w-full border border-gray-300 rounded px-3 py-2 placeholder-black " onChange={changeHandler} value={formData.password}/>
    //       <div className={`absolute bottom-3 right-2 cursor-pointer ${showPassword ? "text-violet-500" : "text-gray-800"} `} onClick={() => setShowPassword((prev) => !prev)} ><AiFillEye /></div>
    //     </div>
    //     <div className="mb-4">
    //       <a href="#" className="text-blue-500 font-semibold">Forgot Password?</a>
    //     </div>
    //     <button type='submit' className="bg-blue-500 text-white py-2 px-4 rounded" style={{  width: '165.34px', height: '40px',left:'997px' }}> {
    //                                 loading ? <Loader /> : "SUBMIT"
    //                             }</button>
    //   </form>
    // </div>

 
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#ffffff' }}>
      {/* Left side */}
      <div style={{ width: '50%' }}>
      
        <img src={Image} alt="Illustration" style={{ width: '100%' }} />
      </div>

      {/* Right side */}
      <Paper elevation={6} style={{ padding: '40px', borderRadius: '10px', maxWidth: '500px', width: '100%', height: 'auto', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
          <Box style={{ width: '100%', height: '100%' }}>
          {/* LogoImage */}
      <center>    <img src={logoPath} alt="Illustration" style={{ width: '50%' }} /> </center>  
            <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%' }}>
           
              <Typography variant="h5" component="h3" gutterBottom style={{ textAlign: 'center' }}>
              Dashboard  Login
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Login As</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={changeHandler}
                  label="Login As"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="Account Manager">Account Manager</MenuItem>
                  <MenuItem value="NOC Manager">NOC Manager</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Username"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={changeHandler}
                variant="outlined"
              />
              <TextField
                margin="normal"
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={changeHandler}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </IconButton>
                  ),
                }}
              />
              <div style={{ marginBottom: '16px' }}>
                <Button onClick={handleClickOpen} style={{ textTransform: 'none', color: '#1976d2' }}>Forgot Password?</Button>
              </div>
              <Button type="submit" variant="contained" color="primary" fullWidth style={{ height: '40px' }}>
                {loading ? <Loader /> : "SUBMIT"}
              </Button>
            </form>
          </Box>
        </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your email address. We will send you a link to reset your password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reset-email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
           { loading2 ?
             
     <div className='p-2 mr-4'> 
     <ThreeDots
     visible={true}
     height="40"
     width="40"
     color="#4fa94d"
     radius="9"
     ariaLabel="three-dots-loading"
     wrapperStyle={{}}
     wrapperClass=""
     />
     </div> 
           
           : <Button onClick={handleSendLink} disabled={!email}>Send Reset Link</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}

