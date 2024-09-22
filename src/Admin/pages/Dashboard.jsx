import { useEffect,useState } from "react";
import React from "react";
import Sidebar from "../Components/Sidebar";
import moment from "moment";
import { useSelector } from "react-redux";
import { apiConnector } from "../../services/apiConnector";
import { Link } from 'react-router-dom';
import {url} from '../../services/api'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight  } from '@fortawesome/free-solid-svg-icons';
import { InfinitySpin } from 'react-loader-spinner'
 
const Dashboard = () => {
  const [dailyProgressReports, setDailyProgressReports] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
   const [allNocTasks, setAllNocTasks] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [reqList,setReqList]=useState([]);
  // const token = localStorage.getItem('token');
  const employee = useSelector((state) => state.employee);
  const headers = {
    Authorization: `Bearer ${employee.token}`,
  };
  const [screenLoad,setScreenLoad]=useState(true);
 
  const[taskCounts,setTaskCounts] =useState({});
    


  useEffect(() => {




    const params = {
      method: "GET",
      url:`${url}/api/taskassigner/tasks/counts`,
      headers: headers,
    };
  apiConnector(params)
    .then((response) => {
      setTaskCounts(response.data);
    })
    .catch((error) => {
      console.error("Error fetching daily progress reports:", error?.data?.response?.message);
      // setLoading(false);
    });




   
      const delay = setTimeout(() => {
        setScreenLoad(false)
        
    }, 1000);  
    return () => clearTimeout(delay);       
  }, []);
 
  return (
    <Sidebar>
       {screenLoad ?
       
     <div  
    //  className="flex justify-center items-center h-screen mt-[-90px]"
      
     className=" top-0 left-0 w-full h-full flex justify-center items-center bg-white opacity-75 z-10"

     >  <InfinitySpin
  visible={true}
  width="200"
  color="#4fa94d"
  ariaLabel="infinity-spin-loading"
  
  />
  </div> 
       
 
  :
  
      <div 
        // className="container-fluid"
      className= {` container-fluid transition-opacity duration-200 ${screenLoad ? 'opacity-0' : 'opacity-100'}`}  >
        {/*<!--* Page Heading -->*/}
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
          <button
            // href="#"
            className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          >
            <i className="fas fa-download fa-sm text-white-50"></i> Current Time
            : {new Date().toLocaleString()}
          </button>
        </div>


        <div className="row">



               {/*<!--* Latest Code example -->*/}
          <div className="col-xl-3 col-md-3 mb-3">
            <div className="card border-left-primary shadow h-100 ">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    {/* {employee?.role==='admin' ?  "Latest Reports" : "My Latest Reports"}  */}
                    Total Task
                    </div>
                    <div className="h5 font-weight-bold text-gray-800">
                    {/* Reports */}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-calendar fa-2x text-gray-300"></i>
                  </div>
                </div>      
                <h1 style={{ fontSize: "5rem",color:"black" }}> {taskCounts?.open} </h1> {/* Increased the font size */}

              </div>
            </div>
          </div>




           {/*<!--* Latest Code example -->*/}
           <div className="col-xl-3 col-md-3 mb-3">
            <div className="card border-left-info shadow h-100 ">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    {/* {employee?.role==='admin' ?  "Latest Reports" : "My Latest Reports"}  */}
                    Pending Task
                    </div>
                    <div className="h5 font-weight-bold text-gray-800">
                    {/* Reports */}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-calendar fa-2x text-gray-300"></i>
                  </div>
                </div>      
                <h1 style={{ fontSize: "5rem",color:"black" }}> {taskCounts?.pending} </h1> {/* Increased the font size */}

              </div>
            </div>
          </div>


          <div className="col-xl-3 col-md-3 mb-3">
            <div className="card border-left-danger shadow h-100 ">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    {/* {employee?.role==='admin' ?  "Latest Reports" : "My Latest Reports"}  */}
                    OPEN Task
                    </div>
                    <div className="h5 font-weight-bold text-gray-800">
                    {/* Reports */}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-calendar fa-2x text-gray-300"></i>
                  </div>
                </div>      
                <h1 style={{ fontSize: "5rem",color:"black" }}> {taskCounts?.open} </h1> {/* Increased the font size */}

              </div>
            </div>
          </div>



          <div className="col-xl-3 col-md-3 mb-3">
            <div className="card border-left-info  shadow h-100 ">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    {/* {employee?.role==='admin' ?  "Latest Reports" : "My Latest Reports"}  */}
                    In Progress Task
                    </div>
                    <div className="h5 font-weight-bold text-gray-800">
                    {/* Reports */}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-calendar fa-2x text-gray-300"></i>
                  </div>
                </div>      
                <h1 style={{ fontSize: "5rem",color:"black" }}> {taskCounts?.progress} </h1> {/* Increased the font size */}

              </div>
            </div>
          </div>


        </div>
        
        
        
        
        
        {/*<!--* Content Row -->*/}





        <div className="row">
         

          {/*<!--* Latest Code example -->*/}
          <div className="col-xl-6 col-md-6 mb-6">
            <div className="card border-left-primary shadow h-100 ">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    {/* {employee?.role==='admin' ?  "Latest Reports" : "My Latest Reports"}  */}
                    Latest Reports
                    </div>
                    <div className="h5 font-weight-bold text-gray-800">
                    {/* {employee?.role==='admin' ?  "Reports"  : "My Reports"}  */}
                    Reports
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-calendar fa-2x text-gray-300"></i>
                  </div>
                </div>

                {/* FIRST ROW FIRST BOX TABLE START */}
                <div className="row overflow-x-auto">
                  <table className=" table-sm min-w-full table-bordered table-hover table-responsive table mt-1   text-sm text-left  ">
                    <thead className="text-xs text-black uppercase bg-gray-200 dark:bg-gray-700 ">
                      <tr>
                        <th scope="col" className=" ">
                          Date
                        </th>
                        <th scope="col" className="">
                          
                          Company Name
                        </th>
                        <th scope="col" className="">
                          Destination
                        </th>
                        <th scope="col" className="">
                          Type
                        </th>
                        <th scope="col" className="">
                          Employee
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4">Loading...</td>
                        </tr>
                      ) : dailyProgressReports.length === 0 ? (
                        <tr>
                          <td colSpan="4">No daily progress reports found</td>
                        </tr>
                      ) : (
                        dailyProgressReports
                          .slice(0, 10)
                          .map((report, index) => (
                            <tr
                              key={index}
                              className="border-b text-black dark:border-gray-900 odd:bg-white even:bg-blue-100"
                            >
                              <td
                                
                                className=" font-medium text-black whitespace-nowrap "
                              >
                                {moment(report.createdAt).format("YYYY-MM-DD")}
                              </td>
                              <td className="">
                                {report.companyName}
                              </td>
                              <td className="text-xs">
                                {report?.destination?.name}
                              </td>
                              <td className="">{report?.type}</td>
                              <td className="">{report.createdBy?.name}</td>
                              {/* <td className="w-1/4">{report.remark}</td> */}
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                  {dailyProgressReports.length === 0 ? null : (
                    <div className="absolute bottom-2 right-2 mr-3">
                      {employee.role === "admin" ? (
                        <Link to="/reports" className="text-purple-900">
                          <FontAwesomeIcon icon={faAnglesRight} />
                        </Link>
                      ) : (
                        <Link to="/amreports" className="text-purple-900">
                          <FontAwesomeIcon icon={faAnglesRight} />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                {/* FIRST ROW FIRST BOX TABLE STOP */}
              </div>
            </div>
          </div>


          {/*<!--* Top working Route -->*/}
          <div className="col-xl-6 col-md-6 mb-6">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Top Priority Task 
                    </div>
                    <div className="row no-gutters align-items-center">
                      <div className="col-auto">
                        <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                          
                        </div>
                      </div>
                     
                     

                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                  </div>
                </div>

                <div className="row overflow-x-auto">
                  <table className="table-sm min-w-full table-bordered table-hover table-responsive table mt-2   text-sm text-left ">
                    <thead className="text-xs text-black uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                      <tr>

                      <th scope="col" className="">
                        Company Name

                          
                        </th>
                        
                        <th scope="col" className="">
                        Destination

                          
                        </th>
                        <th scope="col" className="">
                          
                          Price
                        </th>
                        <th scope="col" className="">
                          Currency
                        </th>
                        <th scope="col" className="">
                          Status
                        </th>
                         
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4">Loading...</td>
                        </tr>
                      ) : allRoutes.length === 0 ? (
                        <tr>
                          <td colSpan="4">No Routes found</td>
                        </tr>
                      ) : (
                        allRoutes.filter((item)=> item.testingStatus==="PASSED" && item.isTopWrokingRoute===true).slice(0, 10).map((route, index) => (
                          <tr
                            key={index}
                            className="border-b text-black dark:border-gray-700 odd:bg-white even:bg-blue-100"
                          >
                             <td   className=" "  >
                              {route?.accountId?.ghostName}
                            </td>
                            <td className="text-xs">{route?.destinationName?.name}</td>
                            
                            <td className="">{route?.ghostVisible===true ? route?.ghostPricing : route?.pricing }</td>
                      
                           
                            <td className="">{route?.currency?.name}</td>
                            <td className="">{route?.testingStatus}</td>
                           
                            
                          </tr>
                        ))
                       
                      )}
                    </tbody>
                  </table>
                  {allRoutes.length === 0 ? null : (
                    <div className="absolute bottom-2 right-2 mr-3">
                      <Link to="/routess" className=" text-purple-900">
                        <FontAwesomeIcon icon={faAnglesRight} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

            {/*<!--* latest Route -->*/}
            <div className="col-xl-6 col-md-6 mb-6">
            <div className="card border-left-success shadow h-100 ">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Latest Routes
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      Routes
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                  </div>
                </div>

                <div className="row overflow-x-auto">
                  <table className="table-sm min-w-full table-bordered table-hover table-responsive table mt-2   text-sm text-left ">
                    <thead className="text-xs text-black uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                      <th scope="col" className="">
                          Company Name
                       </th>
                        <th scope="col" className="">
                        Destination

                          
                        </th>
                        
                        <th scope="col" className="">
                          
                          Price
                        </th>
                        <th scope="col" className="">
                          Currency
                        </th>
                        <th scope="col" className="">
                          Status
                        </th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4">Loading...</td>
                        </tr>
                      ) : allRoutes.length === 0 ? (
                        <tr>
                          <td colSpan="4">No Routes found</td>
                        </tr>
                      ) : (
                        allRoutes.slice(0, 10).map((route, index) => (
                          <tr
                            key={index}
                            className="border-b text-black dark:border-gray-700 odd:bg-white even:bg-blue-100"
                          >
                             <td     className=" "  >
                              {route?.accountId?.ghostName}
                            </td>
                            <td className=" whitespace-nowrap text-xs ">{route?.destinationName?.name}</td>
                            <td className="">{route?.ghostVisible===true ? route?.ghostPricing : route?.pricing }  </td>
                      
                           
                            <td className="">{route?.currency?.name}</td>
                            <td className="">{route?.testingStatus}</td>
                           
                            
                          </tr>
                        ))
                       
                      )}
                    </tbody>
                  </table>
                  {allRoutes.length === 0 ? null : (
                    <div className="absolute bottom-2 right-2 mr-3">
                      <Link to="/routess" className=" text-purple-900">
                        <FontAwesomeIcon icon={faAnglesRight} />
                      </Link>
                    </div>
                  )}
                </div>
                {/* TABLE END */}
              </div>
            </div>
          </div>

          {/*<!--* Latest Account -->*/}
          <div className="col-xl-6 col-md-6 mb-6">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      Latest Account Created
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                     Accounts
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-comments fa-2x text-gray-300"></i>
                  </div>
                </div>

               
               <div className="col-sm-12">

               <div className=" overflow-x-auto">
                  <table className="table-sm min-w-full table-bordered table-hover table-responsive table mt-2   text-sm text-left ">
                    <thead className="text-xs text-black uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="">
                          Company Name
                        </th>
                        <th scope="col" className="">
                        
                          Country
                        </th>
                        <th scope="col" className="">
                          S Count
                        </th>
                        <th scope="col" className="">
                          R Count
                        </th>
                        <th scope="col" className="">
                          Assinged
                        </th>
                        {/* <th scope="col" className="">
                          Type
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4">Loading...</td>
                        </tr>
                      ) : allClients.length === 0 ? (
                        <tr>
                          <td colSpan="4">No Routes found</td>
                        </tr>
                      ) : (
                        allClients.slice(0, 10).map((route, index) => (
                          <tr
                            key={index}
                            className="border-b text-black dark:border-gray-700 odd:bg-white even:bg-blue-100"
                          >
                      
                            <td
                              
                              className=" text-sm  whitespace-nowrap "
                            >
                              {route?.ghostName}
                            </td>
                            <td className="">{route?.country?.name}</td>
                      
                            <td className="">{route?.servicesCount}</td>
                            <td className="">{route?.reqCount}</td>
                            <td className="">{route.assignedTo?.name}</td>
                            {/* <td className="">{route.accountType}</td> */}
                          </tr>
                        ))
                       
                      )}
                    </tbody>
                  </table>

                 
                </div>
                {/* TABLE END */}
               

               </div>


               {allClients.length === 0 ? null : (
                    <div className="absolute bottom-2 right-2 mr-3 ">
                      <Link to="/accounts" className=" text-purple-900">
                        <FontAwesomeIcon icon={faAnglesRight} />
                      </Link>
                    </div>
                  )}



              </div>
            </div>
          </div>
        </div>

        {/*<!--* Content Row -->*/}


             {/*<!--* Last Row -->*/}
        <div className="row">
          {/*<!--* Latest Task created -->*/}
          <div className="col-xl-6 col-lg-6">
            <div className="card shadow mb-4">
              {/*<!--* Card Header - Dropdown -->*/}
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">
                  Latest Task Created </h6>
                {/* <div className="dropdown no-arrow">
                  <a
                    className="dropdown-toggle"
                    href="#"
                    role="button"
                    id="dropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <div className="dropdown-header">Menu:</div>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </div>
                </div> */}
              </div>
              {/*<!--* Card Body -->*/}
              <div className="card-body">
                <div className="row">

                  <div className="col-sm-12">
                 




                  <div className=" overflow-x-auto">
                  <table className="table-sm min-w-full table-bordered table-hover table-responsive table mt-2   text-sm text-left ">
                    <thead className="text-xs text-black uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                      <th scope="col" className="">
                          Company Name
                        </th>
                        <th scope="col" className="">
                          Destination
                        </th>
                        <th scope="col" className="">
                          Assigned From
                        </th>
                        <th scope="col" className="">
                        
                          Route Status
                        </th>
                        <th scope="col" className="">
                          Priority
                        </th>
                        <th scope="col" className="">
                          Task Status
                        </th>
                        <th scope="col" className="">
                          Assinged
                        </th>
                       
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4">Loading...</td>
                        </tr>
                      ) : allNocTasks.length === 0 ? (
                        <tr>
                          <td colSpan="4">No Routes found</td>
                        </tr>
                      ) : (
                        allNocTasks.slice(0, 10).map((item, index) => (
                          <tr
                            key={index}
                            className="border-b text-black dark:border-gray-700 odd:bg-white even:bg-blue-100"
                          >
                             <td className="">{item?.accountDetails?.ghostName}</td>
                             <td className="text-xs  ">{item?.destinationsDetails?.name}</td>
                            <td
                             
                              className=" text-sm  whitespace-nowrap  "
                            >
                              {item?.assignedFrom?.name}
                            </td>
                            <td className="">{item?.service?.testingStatus}</td>
                      
                            <td className="">{item?.priority === 1 ? "HIGH" :item?.priority === 2 ?"MEDIUM":"LOW" }</td>
                            <td className="">{item?.taskStatus}</td>
                            <td className="">{item.assignedTo?.name}</td>
                            
                          </tr>
                        ))
                       
                      )}
                    </tbody>
                  </table>

                 
                </div>
                {/* TABLE END */}
               







                  </div>
               

                 
                  <div className="row absolute  bottom-2 right-2 mr-2 mt-4 ">
                    <Link to="/tasks"  className=" text-purple-900">
                      <FontAwesomeIcon icon={faAnglesRight} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*<!--* Latest Req added -->*/}
          <div className="col-xl-6 col-lg-6">
            <div className="card shadow mb-4">
              {/*<!--* Card Header - Dropdown -->*/}
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Latest Requirements</h6>
                {/* <div className="dropdown no-arrow">
                  <a
                    className="dropdown-toggle"
                    href="#"
                    role="button"
                    id="dropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <div className="dropdown-header">Dropdown Header:</div>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </div>
                </div> */}
              </div>
              {/*<!--* Card Body -->*/}
              <div className="card-body">

              <div className=" col-sm-12">
               
              
              <div className=" overflow-x-auto">
                  <table className="table-sm min-w-full table-bordered table-hover table-responsive table mt-2   text-sm text-left ">
                    <thead className="text-xs text-black uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                      <th scope="col" className="">
                          Company Name
                        </th>
                        <th scope="col" className="">
                          Destination
                        </th>
                        <th scope="col" className="">
                         Pricing
                        </th>
                        <th scope="col" className="">
                          Volume
                        </th>
                        <th scope="col" className="">
                          Created By
                        </th>
                       
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4">Loading...</td>
                        </tr>
                      ) : reqList.length === 0 ? (
                        <tr>
                          <td colSpan="4">No Requirements found</td>
                        </tr>
                      ) : (
                        reqList.slice(0, 10).map((item, index) => (
                          <tr
                            key={index}
                            className="border-b text-black dark:border-gray-700 odd:bg-white even:bg-blue-100"
                          >
                             <td className="">{item?.accountId?.ghostName}</td>
                             <td className="text-xs  ">{item?.destinationName?.name}</td>
                            <td className=""   >
                              {item?.pricingRange[0] }  - {item?.pricingRange[1] }
                            </td>
                             
                            {/* <td className="">{item?.service?.testingStatus}</td> */}
                      
                            <td className="">{item?.volume}</td>
                            <td className="">{item.createdBy?.name}</td>
                            
                          </tr>
                        ))
                       
                      )}
                    </tbody>
                  </table>

                 
                </div>

                
              </div>

              </div>
            </div>
          </div>
        </div>

      
        
      </div> 
      }

    </Sidebar>
  );
};

export default Dashboard;



