import React, { useState,useEffect } from 'react';
// import './Sidebar.css';
import './navsidebar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { NavLink , useNavigate } from 'react-router-dom';
import { ReactComponent as MappingIcon } from "../assets/icon-park-outline_mind-mapping.svg";
import { ReactComponent as ProfileIcon } from "../assets/flowbite_profile-card-outline.svg";
// import { ReactComponent as SettingIcon } from "../assets/material-symbols_settings.svg";
import { ReactComponent as Report } from "../assets/bxs_report.svg";
import { ReactComponent as Notifications } from "../assets/ion_notifications.svg";
import { ReactComponent as Majesti } from "../assets/majesticons_data.svg"
import { ReactComponent as Dashboard } from "../assets/material-symbols_dashboard.svg"
import { ReactComponent as Requirements } from "../assets/pajamas_issue-type-requirements.svg"
import { ReactComponent as Tasks } from "../assets/material-symbols_task.svg"
import { logoutemployee } from '../../features/employeeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { apiConnector } from '../../services/apiConnector';
import {url} from '../../services/api'
import 'react-toastify/dist/ReactToastify.css';
import LogoImage from '../assets/logo_tapvox.png';
import swipeLogoImage from '../assets/swipedesk.png';

 
const Sidebar = ({children}) => {
            //navbar-nav bg-gray-800 sidebar sidebar-dark accordion
    const logoPath = process.env.REACT_APP_NAME==='TAPDESK'? LogoImage : process.env.REACT_APP_NAME==='SWIPEDESK' ?swipeLogoImage : '';

    const [sideBarToggle,SetSideBarToggle] = useState("navbar-nav bg-[#101825] sidebar sidebar-dark accordion");

    const toggleSideBar = () =>{
            if(sideBarToggle==="navbar-nav bg-[#101825] sidebar sidebar-dark accordion"){
                SetSideBarToggle("navbar-nav bg-[#101825] sidebar sidebar-dark accordion toggled");
            }else
            SetSideBarToggle("navbar-nav bg-[#101825] sidebar sidebar-dark accordion");
    }

    const employee = useSelector((state) => state.employee)
    const headers = {
        Authorization: `Bearer ${employee.token}`,
      };
    const [me, setMe] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        dispatch(logoutemployee(null))
        navigate('/')
    }
    useEffect(() => {

        const params = {
          method: "GET",
          url: `${url}/api/taskassigner/users/${employee._id}`,
           headers: headers,
        };
    
        apiConnector(params)
          .then((response) => {
            setMe(response.data);
            // setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching details:", error);
            // setLoading(false);
          });
      }, []);

  
    const menuItem=[
        {
            path:"/dashboard",
            name:"Dashboard",
            icon: <Dashboard className='h-6 svgheight' />,  
            role: ['admin', 'delegator', 'executor'],
        },

        {
            path:"/tasks",
            name:"Tasks",
            icon:<Tasks className='h-6 svgheight'/>,
            role: ['admin', 'delegator','executor'],
        }, 
       
       
      
       
    ]
    /* Ellipse 5 */


// background: #F2F3F5;
const [newNotificationCount,setNewNotificaitonCount]=useState(0);
// const [sound, setSound] = useState(null);
const [last5UnRead,setLast5UnRead]=useState([])








    return (
<div id="root">
        <div id="page-top">
      


{/*<!--* Page Wrapper -->*/}
<div id="wrapper" key={"1000"}>

    {/*<!--* Sidebar -->*/}
    <ul className={sideBarToggle} id="accordionSidebar">

        {/*<!--* Sidebar - Brand -->*/}
        {me &&    <button className="sidebar-brand d-flex align-items-center justify-content-center mt-2" href="#">
            <div className="sidebar-brand-icon rotate-n-1">
                {/* <i className="fas fa-laugh-wink"></i> */}
                <FontAwesomeIcon icon={faCircleUser} style={{ fontSize: '3.5rem',color:'white' }} />
            </div>
            <div className="sidebar-brand-text mx-3">{me.name} 
            {/* <br/> <sup style={{fontSize :'8px'}}>{me.role}</sup> */}
            </div>
            {/* <div className="sidebar-brand-text mx-3">{me.role} <sup>{me.role}</sup></div> */}
        </button>
        }

 


        {/*<!--* Divider -->*/}
        <hr className="sidebar-divider my-1"/>

        {/*<!--* Nav Item - Dashboard -->*/}
        {/* <li className="nav-item active">
            <a className="nav-link" href="index.html">
                <i className="fas fa-fw fa-tachometer-alt"></i>
                <span>Dashboard</span></a>
        </li> */}



        {
                   menuItem.map((item, index)=>{
                    return (
                        item?.role?.includes(employee?.role) &&


                   
                    <li key={index} className="nav-item ml-1 -mb-1 text-white py-1 bg-gray"   >
                    <NavLink to={item.path}   className="link flex " activeclassname="active">
                    {/* <a className="nav-link link" href={item.path}> */}
                                <span className='flex p-2'>
                                <i className="mr-0 -ml-4">{ item.icon } </i>
                                <span className='-ml-1 mt-0.5 smalltxt'>{item.name}</span>
                                </span>
                    
                        
                    {/* </a> */}
                    </NavLink>
                    </li>
                    
                  

                  )
                })
            }




  





        {/*<!--* Sidebar Toggler (Sidebar) -->*/}
        <div className="text-center d-none d-md-inline">
            <button className="rounded-circle border-0" id="sidebarToggle" onClick={toggleSideBar}></button>
        </div>



    </ul>
    {/*<!--* End of Sidebar -->*/}

    {/*<!--* Content Wrapper -->*/}
    <div id="content-wrapper" className="d-flex flex-column">

        {/*<!--* Main Content -->*/}
        <div id="content">

            {/*<!--* Topbar -->*/}
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                {/*<!--* Sidebar Toggle (Topbar) -->*/}
                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3" onClick={toggleSideBar}>
                    <i className="fa fa-bars"></i>
                </button>
                <img src={logoPath} alt="Illustration" style={{ width: '10%' }} />  
                <p className='h5 text-black shadow-xs text-capitalize ml-3'> {employee.role} Dashboard  { employee.category!=="null" &&  [employee.category] } </p>

                {/*<!--* Topbar Search -->*/}
                {/* <form
                    className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                    <div className="input-group">
                        <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..."
                            aria-label="Search" aria-describedby="basic-addon2"/>
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="button">
                                <i className="fas fa-search fa-sm"></i>
                            </button>
                        </div>
                    </div>
                </form> */}

                {/*<!--* Topbar Navbar -->*/}
                <ul className="navbar-nav ml-auto">

                    {/*<!--* Nav Item - Search Dropdown (Visible Only XS) -->*/}
                    <li className="nav-item dropdown no-arrow d-sm-none">
                        {/* <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-search fa-fw"></i>
                        </a> */}
                        {/*<!--* Dropdown - Messages -->*/}
                        <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                            aria-labelledby="searchDropdown">
                            {/* <form className="form-inline mr-auto w-100 navbar-search">
                                <div className="input-group">
                                    <input type="text" className="form-control bg-light border-0 small"
                                        placeholder="Search for..." aria-label="Search"
                                        aria-describedby="basic-addon2"/>
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="button">
                                            <i className="fas fa-search fa-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </form> */}
                        </div>
                    </li>

                    {/*<!--* Nav Item - Alerts -->*/}
                    <li className="nav-item dropdown no-arrow mx-1">
                        <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-bell fa-fw"></i>
                            {/*<!--* Counter - Alerts -->*/}
                            <span className="badge badge-danger badge-counter">{newNotificationCount!==0 &&`${newNotificationCount}`}</span>
                        </a>
                        {/*<!--* Dropdown - Alerts -->*/}
                        <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                            aria-labelledby="alertsDropdown">
                            <h6 className="dropdown-header">
                                Unread Notifications
                            </h6>
                        
                           { last5UnRead && last5UnRead.length===0? 
                           
                           <a className="dropdown-item d-flex align-items-center" href="#">
                                <div className="mr-3">
                                    <div className="icon-circle bg-primary">
                                        <i className="fas fa-file-alt text-white"></i>
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500">{new Date().toLocaleDateString()}</div>
                                    <span className="font-weight-bold">No Unread Notification!</span>
                                </div>
                            </a>
                           
                           
                           : last5UnRead.map((item,index)=>(


                            <a key={index} className="dropdown-item d-flex align-items-center" href="#">
                                <div className="mr-3">
                                    <div className="icon-circle bg-primary">
                                        <i className="fas fa-file-alt text-white"></i>
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500"> {new Date(item.createdAt).toLocaleString()}</div>
                                    <span className="font-weight-bold">{item.message}</span>
                                </div>
                            </a>
                           ) )  }
                            {/* <a className="dropdown-item d-flex align-items-center" href="#">
                                <div className="mr-3">
                                    <div className="icon-circle bg-success">
                                        <i className="fas fa-donate text-white"></i>
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500">December 7, 2019</div>
                                    $290.29 has been deposited into your account!
                                </div>
                            </a> */}
                            {/* <a className="dropdown-item d-flex align-items-center" href="#">
                                <div className="mr-3">
                                    <div className="icon-circle bg-warning">
                                        <i className="fas fa-exclamation-triangle text-white"></i>
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500">December 2, 2019</div>
                                    Spending Alert: We've noticed unusually high spending for your account.
                                </div>
                            </a> */}
                            <a className="dropdown-item text-center small text-gray-500" href="#">Go to Notifications</a>
                        </div>
                    </li>

                   {/* MESSAGE CENTER PLACE REMOVEE */}
                    <div className="topbar-divider d-none d-sm-block"></div>

                    {/*<!--* Nav Item - User Information -->*/}
                    <li className="nav-item dropdown no-arrow">
                        <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          { me &&  <span className="mr-2 d-none d-lg-inline text-gray-600 small">{ me.name && me.name.toUpperCase()}</span>}
                            <img className="img-profile rounded-circle"
                                src="img/undraw_profile.svg"/>
                        </a>
                        {/*<!--* Dropdown - User Information -->*/}
                        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                            aria-labelledby="userDropdown">
                            <a className="dropdown-item" href="#" onClick={()=> {navigate("/dashboard")}}>
                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                Dashboard
                            </a>
                            <a className="dropdown-item" href="#" onClick={()=> {navigate("/settings")}}>  
                                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                {/* <NavLink to="/settings" className="hover:no-underline hover:text-current hover:no-underline focus:bg-transparent"> Settings </NavLink>   */}
                                Settings
                            </a>
                            {/* <a className="dropdown-item" href="#">
                                <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                                Activity Log
                            </a> */}
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                Logout
                            </a>
                        </div>
                    </li>

                </ul>

            </nav>
            {/*<!--* End of Topbar -->*/}

            {/*<!--* Begin Page Content -->*/}
           
            {children}

            {/*<!--* /.container-fluid -->*/}

        </div>
        {/*<!--* End of Main Content -->*/}

        {/*<!--* Footer -->*/}
        <footer className="sticky-footer bg-white">
            <div className="container my-auto">
                <div className="copyright text-center my-auto">
                    <span>Copyright &copy;{process.env.REACT_APP_NAME} { new Date().getFullYear()}</span>
                </div>
            </div>
        </footer>
        {/*<!--* End of Footer -->*/}

    </div>
    {/*<!--* End of Content Wrapper -->*/}

</div>
{/*<!--* End of Page Wrapper -->*/}

{/*<!--* Scroll to Top Button-->*/}
<a className="scroll-to-top rounded" href="#page-top">
    <i className="fas fa-angle-up"></i>
</a>

{/*<!--* Logout Modal-->*/}
<div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div className="modal-dialog" role="document">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div className="modal-body">Confirm Logout?</div>
            <div className="modal-footer">
                <button className="btn bg-red-500 text-white" type="button" data-dismiss="modal">Cancel</button>
                <button className='btn bg-cyan-500 text-white' type='button' data-dismiss="modal" onClick={handleLogout}>Logout</button>
                {/* <a className="btn btn-primary" href="#" onClick={handleLogout}>Logout</a> */}
            </div>
        </div>
    </div>
</div>



</div>

</div>

    );
};

export default Sidebar;
