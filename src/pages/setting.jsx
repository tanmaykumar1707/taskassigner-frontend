

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faCircleUser } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Admin/Components/Sidebar";
import { apiConnector } from "../services/apiConnector";
import { url } from "../services/api";

import EmployeeCompo from '../components/EmployeeCompo'

//import EmployeeGroupCompo from "../Components/EmployeeGroupCompo";
// import { Skeleton, Grid, Box, Button } from '@mui/material';
import {
  Box,
  Grid,
  Skeleton,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Slide
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import toast from "react-hot-toast";
import { ThreeDots } from 'react-loader-spinner'


const Setting = () => {


  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState([]);



  const employee = useSelector((state) => state.employee);


  const headers = {
    Authorization: `Bearer ${employee.token}`,
  };
  
  
  useEffect(() => {
    const params = {
      method: "GET",
      url: `${url}/api/taskassigner/users/${employee._id}`,
      headers: headers,
    };

    apiConnector(params)
      .then((response) => {
        setMe(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching details:", error);
        setLoading(false);
      });
  }, []);



    

    const [loadingg, setLoadingg] = useState(true);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setLoadingg(false);
      }, 1000);
  
      return () => clearTimeout(timer);
    }, []);
  


    const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [passLoader,setPassLoader]=useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOpen(false);
  };

  const handleChangePassword = async () => {
 
    setPassLoader(true);
    if(!oldPassword || oldPassword.trim()===''){
      toast.error("Old Password must not be blank!");
      setPassLoader(false);
        return false;
    }
  
    if(!newPassword || newPassword.trim()===''  || newPassword.length <6){
      toast.error("New Password must be minimum 6 characters!");
      setPassLoader(false);
        return false;
    }

    if(newPassword!==confirmPassword){
        toast.error("New Passwords not matched!");
        setPassLoader(false);
        return false;
    }
 

    try{
      
      let response = await apiConnector({
      method: "POST",
      url: `${url}/api/changePassword`,
      bodyData: {
        oldPassword:oldPassword,
        newPassword:newPassword
      },
      headers: headers,
    });

    if(response.status===200){
      toast.success(`${response?.data?.message}`);
      handleClose();
    }

  }catch(error){
    toast.error(`${error?.response?.data?.message}`);
  }

  setPassLoader(false);


   
  };

  const togglePasswordVisibility = (setShowPassword) => {
    setShowPassword((show) => !show);
  };

  return (
    <Sidebar>
      <div className="container-fluid mb-50">
        {/* <!-- Page Heading --> */}
       
        <h1 className="h3 mb-4 text-gray-800">Setting</h1>
   

<br/> 
<br/> 






    <Paper
      elevation={8}
      sx={{
        width: '100%',
        padding: 2,
        borderRadius: 4,
        position: 'relative',
        backgroundColor: 'white', // Set background color to white
        '@media (min-width: 970px)': {
          width: '40%',
        },
        fontSize: '100%',
        '@media (max-width: 970px)': {
          fontSize: '70%',
        },
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          {loadingg ? (
            <Skeleton animation="wave" variant="circular" width={60} height={60} />
          ) : (
            <FontAwesomeIcon icon={faCircleUser} style={{ fontSize: '3.5rem' }} />
          )}
        </Grid>
        <Grid item xs>
          {loadingg ? (
            <Skeleton animation="wave" variant="rectangular" width="100%" height={50} />
          ) : (
            <Box>
              <Typography variant="h6" color="textPrimary">
                {me?.name?.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {me?.email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {me?.phone}
              </Typography>
              <Button
             variant="text"
                color="error"
                size="small"
                onClick={handleOpen}
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                }}
              >
                Change Password
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog open={open} onClose={handleClose}   TransitionComponent={Slide} TransitionProps={{timeout:200}}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Old Password"
            type={showOldPassword ? 'text' : 'password'}
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility(setShowOldPassword)}
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
        { passLoader ?  <div className='p-2 mr-4'> 
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
     </div> :  <Button onClick={handleChangePassword} color="primary">
            Change Password
          </Button>}
        </DialogActions>
      </Dialog>
    </Paper>




     { employee?.role==='admin' && <> 
  
        <div className="row mt-3">
          {/* button  and heading */}

          <div className="flex justify-between mb-2">
            <h1 className="h5 mb-3 text-gray-800 justify-content">
              Manage Master Datas
            </h1>
          </div>

          <div className="col-sm-12">
            {/* user tabs */}
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="country-tab"
                  data-toggle="tab"
                  data-target="#country"
                  type="button"
                  role="tab"
                  aria-controls="country"
                  aria-selected="true"
                  
                >
                  Currency List
                </button>
              </li>
            
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="product-tab"
                  data-toggle="tab"
                  data-target="#product"
                  type="button"
                  role="tab"
                  aria-controls="product"
                  aria-selected="false"
                >
                  Country List
                </button>
              </li>

              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="qualityCategory-tab"
                  data-toggle="tab"
                  data-target="#qualityCategory"
                  type="button"
                  role="tab"
                  aria-controls="qualityCategory"
                  aria-selected="false"
                >
                  Quality Category
                </button>
              </li>

              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="timeZone-tab"
                  data-toggle="tab"
                  data-target="#timeZone"
                  type="button"
                  role="tab"
                  aria-controls="timeZone"
                  aria-selected="false"
                >
                  Time Zone
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="paymentCycle-tab"
                  data-toggle="tab"
                  data-target="#paymentCycle"
                  type="button"
                  role="tab"
                  aria-controls="paymentCycle"
                  aria-selected="false"
                >
                  Payment Cycle
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="empGroup-tab"
                  data-toggle="tab"
                  data-target="#empGroup"
                  type="button"
                  role="tab"
                  aria-controls="empGroup"
                  aria-selected="false"
                >
                  NOC Manager Group
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="destination-tab"
                  data-toggle="tab"
                  data-target="#destination"
                  type="button"
                  role="tab"
                  aria-controls="destination"
                  aria-selected="false"
                >
                  Destination
                </button>
              </li>

            </ul>

            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active bg-transparent"
                id="country"
                role="tabpanel"
                aria-labelledby="country-tab"
              >
                <div className="col-sm-12">
                  
                  {/* <Currency /> */}
                </div>
              </div>
           

              <div
                className="tab-pane fade bg-transparent mt-3"
                id="product"
                role="tabpanel"
                aria-labelledby="product-tab"
              >
                <div className="col-sm-12 mt-3 ">
                  {/* <Country /> */}
                </div>
              </div>

              <div
                className="tab-pane fade bg-transparent mt-3"
                id="qualityCategory"
                role="tabpanel"
                aria-labelledby="qualityCategory-tab"
              >
                <div className="col-sm-12 mt-3 ">
                  {/* <QualityCategory /> */}
                </div>
              </div>

              <div
                className="tab-pane fade bg-transparent mt-3"
                id="timeZone"
                role="tabpanel"
                aria-labelledby="timeZone-tab"
              >
                <div className="col-sm-12 mt-3 ">
                  {/* <TimeZone /> */}
                </div>
              </div>

              <div
                className="tab-pane fade bg-transparent mt-3"
                id="paymentCycle"
                role="tabpanel"
                aria-labelledby="paymentCycle-tab"
              >
                <div className="col-sm-12 mt-3 ">
                  {/* <PaymentCycle /> */}
                </div>
              </div>

              <div
                className="tab-pane fade bg-transparent mt-3"
                id="empGroup"
                role="tabpanel"
                aria-labelledby="empGroup-tab"
              >
                <div className="col-sm-12 mt-3  text-black ">
                  {/* <EmployeeGroupCompo/> */}
                </div>
              </div>


              <div
                className="tab-pane fade bg-transparent mt-3"
                id="destination"
                role="tabpanel"
                aria-labelledby="destination-tab"
              >
                <div className="col-sm-12 mt-3  text-black ">
                  {/* <Destination/> */}
                </div>
              </div>



            </div>
          </div>
        </div>
        <br></br>
        <br></br> <hr></hr> <br></br>
        <br></br>


        {/* EMPLOYEE MANAGE */}


        {/* MANAGE USERS SECTION */}
        <div className="row">
          {/* button  and heading */}

          <div className="flex justify-between mb-2">
            <h1 className="h5 mb-4 text-gray-800 justify-content">
              Manage Employees
            </h1>
          </div>

          <div className="col-sm-12">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="home-tab"
                  data-toggle="tab"
                  data-target="#home"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true"
                >
                  All Employee
                </button>
              </li>
            </ul>

            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active bg-white "
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <EmployeeCompo />
              </div>
            </div>


          </div>
        </div>
        </>}
      </div>
     
    </Sidebar>
  );
};

export default Setting;
