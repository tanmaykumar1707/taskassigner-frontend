import React,{useState} from 'react'
import {
    Box,
    Button,
    Typography,
    Paper,
 
    TextField,
    InputAdornment,
    IconButton,
  
  } from '@mui/material';
  import { Visibility, VisibilityOff } from '@mui/icons-material';
  import axios from 'axios';
  import {url} from '../../services/api'
  import toast from "react-hot-toast";
  import { useLocation  } from 'react-router-dom';
  import { useNavigate } from 'react-router-dom'

function ResetPassword() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
   const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
   const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 

  const handleChangePassword = async () => {
    // Add your password change logic here

    if(!newPassword || newPassword.trim()===''   ){
      toast.error("Please enter password  ");
        return false;
    }

    if(  newPassword.length <6){
      toast.error("Password must be minimum 6 characters!");
        return false;
    }

    if(newPassword!==confirmPassword){
        toast.error("Password not matched!");
        return false;
    }

    try{
        const res = await axios.post(`${url}/api/resetPassword`, {
            newPassword: confirmPassword,
            token : queryParams.get('token'),
            userId : queryParams.get('id')
            });
      
            if(res.status===200){
              navigate("/");
              toast.success(`${res?.data?.message}`);
            }
      
        }catch(error){
          toast.error(`Error : ${error?.response?.data?.message}`)
        }
    
  };

  const togglePasswordVisibility = (setShowPassword) => {
    setShowPassword((show) => !show);
  };


  return (
    <div className='container-fluid'> 


{/* <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Full viewport height
        // backgroundColor: '#ffffff', // Optional: for visualization
      }}
    >
      <Paper
          elevation={15}
        sx={{
          width: '100%',
          padding: 2,
          borderRadius: 4,
          position: 'relative',
          backgroundColor: '#ffffff', // Set background color to white
          '@media (min-width: 970px)': {
            width: '40%',
          },
          fontSize: '100%',
          '@media (max-width: 970px)': {
            fontSize: '70%',
          },
        }}
      >
        <Typography variant="h5" component="div">
          Change  Password
        </Typography>

         
          <TextField
            margin="dense"
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility(setShowNewPassword)}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility(setShowConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
      
         <Button onClick={()=> navigate("/")} variant='contained' color="info"> Login Page </Button>
          <Button onClick={handleChangePassword} variant="contained"  color="primary">
            Submit 
          </Button>
       

      </Paper>
    </Box> */}


<Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Paper
        elevation={15}
        sx={{
          width: '100%',
          padding: 2,
          borderRadius: 4,
          position: 'relative',
          backgroundColor: '#ffffff',
          '@media (min-width: 970px)': {
            width: '40%',
          },
          fontSize: '100%',
          '@media (max-width: 970px)': {
            fontSize: '70%',
          },
        }}
      >
        <Typography variant="h5" component="div">
          Change Password
        </Typography>

        <TextField
          margin="dense"
          label="New Password"
          type={showNewPassword ? 'text' : 'password'}
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility(setShowNewPassword)}
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="dense"
          label="Confirm New Password"
          type={showConfirmPassword ? 'text' : 'password'}
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility(setShowConfirmPassword)}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <Button onClick={() => navigate("/")} variant="contained" color="info" sx={{ marginRight: 2 }}>
            Login Page
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            color="primary"
            sx={{
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
              '&:hover': {
                backgroundColor: '#FF8E53',
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>



    </div>
  )
}

export default ResetPassword