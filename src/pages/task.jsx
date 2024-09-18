import React, { useState,useEffect,useRef }  from 'react'

import Sidebar from "../Admin/Components/Sidebar";
import TaskCompo from '../components/TaskCompo'


import { useSelector } from "react-redux";

import { apiConnector } from "../services/apiConnector";
import { url } from "../services/api";

import toast from "react-hot-toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Loader from "../components/loader/loader";




function Task() {

    //setting employee from state
    const employee = useSelector((state) => state.employee);
    const headers = {
          Authorization: `Bearer ${employee.token}`,
        };
  const closeRefServ = useRef();
  const serFormRef=useRef();
  const openSerModalRef=useRef();

  const [loading, setLoading] = useState(false);
  const [serviceEditData,setserviceEditData]=useState({});
  const [nocData,setNOCData]=useState([]);
  const [nocGroupData,setNOCGroupData]=useState([]);

  const[showIndiGroup,setShowIndiGroup]=useState("i");

  const [loadComponent,SetLoadComponent] = useState(false);

  const [numSuppliers, setNumSuppliers] = useState(1);
  const [suppliers, setSuppliers] = useState(Array(numSuppliers).fill({ name: '', price: '' }));


useEffect(()=>{
  setShowIndiGroup(serviceEditData?.assignedToType==='EmployeeGroup'?'g':'i')
},[serviceEditData]);


  useEffect(()=>{

    const paramsNoc = {
            method: "GET",
            url:   `${url}/api/taskassigner/users/enabled`,
            headers: headers,
          }; 
  
    if(paramsNoc?.url!==""){
        apiConnector(paramsNoc)
          .then((response) => {
            setNOCData(response.data.users);
              
          })
          .catch((error) => {
            console.error("Error fetching daily progress reports:", error);
            // setLoading(false);
          });
    }
  
  
  //TO DO
    const paramsGroupNoc = {
      method: "GET",
      url:    `${url}/api/taskassigner/users/enabled` ,
      headers: headers,
    }; 
  
  if(paramsGroupNoc?.url!==""){
  apiConnector(paramsGroupNoc)
    .then((response) => {
      setNOCGroupData(response.data.users);
        
    })
    .catch((error) => {
      console.error("Error fetching daily progress reports:", error);
    });
  }
  
  },[serviceEditData]);


  const resetEditForm = ()=>{
    serFormRef.current.reset();
   setserviceEditData({});
   setNumSuppliers(1);
   setSuppliers([]);

 }


 




const handleSubmitRoutingtask = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const taskSubject = formdata.get('subject');
    const remarks = formdata.get('remarks');

    if (!taskSubject || taskSubject.trim() === '') {
      toast.error("Task Subject Required!");
      setLoading(false);
      return false;
    }
    
    if(showIndiGroup==="i"){
      const asgnId=formdata.get('assignedTo');
      if(!asgnId || asgnId==="" || asgnId.length<1){
        toast.error("Select the NOC!");
        return false
      }
      formdata.append('groupFlag', "i");
    }else if(showIndiGroup==="g"){
      const groupId=formdata.get('assignedToGroup');
      if(!groupId || groupId==="" || groupId.length<1){
        toast.error("Select the Group!");
        return false
      }
      formdata.append('groupFlag', "g");
    }else
    {
      toast.error("Some error occured in NOC Assign");
      return false;
  }



  try {
    let response = await apiConnector({
      method: (serviceEditData && serviceEditData?._id) ? "PUT": "POST",
      url: (serviceEditData && serviceEditData?._id) ? `${url}/api/taskassigner/tasks/${serviceEditData?.taskId}`  :  `${url}/api/taskassigner/tasks`,
      bodyData: {
        subject:taskSubject,
        remarks:remarks,
        assignedTo: formdata.get('assignedTo'), 
        assignedToType:formdata.get('groupFlag')
      },
      headers: headers,
    });

    if (response.status === 201) {
     SetLoadComponent(!loadComponent);
      closeRefServ.current.click();
      serFormRef.current.reset();
      toast.success(" Task Added successfully");
    }else if (response.status === 200) {
      SetLoadComponent(!loadComponent);
      toast.success(" Task Updated successfully");
      closeRefServ.current.click();
      serFormRef.current.reset();
      setserviceEditData({});
    }else{
        toast.error("Some Error Occured");
    }
    setLoading(false);

  } catch (error) {
    setLoading(false);
    console.error('Error submitting form:', error);
    toast.error(error?.response?.data?.message);
  }

    

  }


  return (

    <Sidebar>
      <div className='container-fluid'> 
             <h2> Task Creation and Assign</h2>
        <div className="row mt-3">
          <div className="flex justify-between mb-2">
          {/* <h1 className="h5 mb-3 text-gray-800 justify-content">
            Create and Assign
          </h1> */}
        </div>

        <div className="col-sm-12">
          <div className="row mt-3 ">
             { (employee.role==='admin' || employee.role==='Account Manager')  && <button
                  type="button"
                  className=" btn bg-blue-700 text-sm text-white border-white shadow-lg mb-2"
                  data-toggle="modal"
                  data-target="#addNewAccModal"
                  ref={openSerModalRef}
                >
                  Create Routing Task
                  <FontAwesomeIcon className="ml-1" icon={faPlus} />
                </button>}   

            
           {/* Form start */}
              <div
                className="modal  fade "
                id="addNewAccModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="addNewAccModalTitle"
                aria-hidden="true"
                data-backdrop="static"
              >
                <div
                  className="modal-dialog modal-dialog-centered "
                  role="document"
                >
                  <form    onSubmit={handleSubmitRoutingtask} 
                  ref={serFormRef}>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h2 className="font-semibold text-xl text-gray-600">
                          {serviceEditData?._id ? "Update":"New"} Task Addition 
                        </h2>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                          ref={closeRefServ}
                          onClick={resetEditForm}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="row    p-1  flex items-center justify-center ">
                          <div className="container  ">
                            <div>
                              <div className="bg-white rounded shadow-lg p-4 px-4 md:p-2 mb-6">
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                  <div className="lg:col-span-4">
                                    <div className="grid text-black gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                                    <div className="md:col-span-6">
                                    </div>
                                     
                                    <div className=" md:col-span-6">
                                        <label htmlFor="subject">
                                          Subject:
                                        </label>
                                        <input
                                          type="text"
                                          id="taskSubject"
                                          name="subject"
                                          className="form-control"
                                          defaultValue={serviceEditData?.subject}
                                        />
                                      </div>

                                

                        <div className="md:col-span-6 flex items-center" >
                              <label htmlFor="assignedTo" className='w-2/5'>Assigned To:</label>
                                
                                {/* <div className="w-2/5 col-sm-12 p-1">  */}
                                   <input type="radio" value="indi" name="giRadio"  checked={showIndiGroup === 'i' }  onChange={()=>setShowIndiGroup("i")} className=" w-1.5/5"/> &nbsp;Individual &nbsp;&nbsp;
                                    <input type="radio" value="group" name="giRadio"  checked={showIndiGroup === 'g' }  onChange={()=>setShowIndiGroup("g")} className="w-1.5/5"/>&nbsp; Group
                                {/* </div> */}
                         </div>     
                         { ( showIndiGroup ==="g" )&&    <select
                                className="form-control md:col-span-6"
                                name="assignedToGroup"
                              >
                                <option value="">Select Group</option>
                                {nocGroupData &&
                                  nocGroupData.map((item, index) => (
                                    <option key={index} value={item._id} 
                                     selected={   (serviceEditData && serviceEditData?.assignedTo?._id ===item._id) ? true:false  } 
                                      >
                                      {item.name}[{item?.empList?.length} Member - {item.productCategory}]
                                    </option>
                                  ))}
                              </select>}

                            { (showIndiGroup==="i" )&& <select
                                className="form-control md:col-span-6"
                                name="assignedTo"
                              >
                                <option value="">Select NOC</option>
                                {nocData &&
                                  nocData?.map((item, index) => (
                                    <option key={index} value={item.userId} 
                                     selected={   (serviceEditData.assignedTo ===item.userId) ? true:false  } 
                                      >
                                      {item.name}[{item.email}]
                                    </option>
                                  ))}
                              </select>}

                           

                                      <div className="md:col-span-6  m-2">
                                      <label htmlFor="remarks">Remarks:</label>
                                      <textarea
                                        type="text"
                                        id="remarks"
                                        name="remarks"
                                        className=" form-control"
                                        defaultValue={  serviceEditData?.remarks ? serviceEditData?.remarks :''}
                                    
                                      ></textarea>
                                    </div>

                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="modal-footer md:col-span-7 flex justify-between  ">
                        <button
                          type="button"
                          className=" bg-red-600 mr-auto text-md flex justify-content  text-white rounded px-4 py-1 font-medium"
                          data-dismiss="modal" onClick={resetEditForm}
                        >
                          Close
                        </button>

                        <button
                          className=" text-md bg-blue-400 flex justify-content  text-white rounded px-4 py-1 font-medium"
                          type="submit"
                        >
                          {loading ? <Loader /> : serviceEditData?._id ? "UPDATE" : "ADD"}
                        </button>
                      </div>
                    </div>{" "}
                  </form>
                </div>
              </div>

              {/*  form end */}
              </div>
        </div>
      </div>



<h2 className='text-bold text-black'> {employee.role==='NOC Manager' ? "Routing Task Assigned to You" :"Routing Task Assigned by You"}  </h2>


<br/>
      <TaskCompo 
      // accountIdProps={id} 
      reload={loadComponent} openModal={openSerModalRef}  
      fetchType ={ employee.role==='NOC Manager' ? "ASSIGNED_TO_ME" :"ASSIGNED_FROM_ME"}
       serviceEditData={ serviceEditData} setserviceEditData={setserviceEditData} 
                // setShowGhostPriceBox={setShowGhostPriceBox}
                />


<br/><br/>

<h1 className='text-bold text-black'> All Routing Task</h1>

<br/>

<TaskCompo 
      // accountIdProps={id} 
      reload={loadComponent} openModal={openSerModalRef}  
      fetchType ={"ALL_TASK"}
       serviceEditData={ serviceEditData} setserviceEditData={setserviceEditData} 
                // setShowGhostPriceBox={setShowGhostPriceBox}
                />


      </div>
    </Sidebar>
   
  )
}

export default Task;