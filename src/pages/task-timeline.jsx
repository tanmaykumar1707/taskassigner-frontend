import React, { useEffect, useState,useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation  } from 'react-router-dom';
import Sidebar from "../Admin/Components/Sidebar";

import { apiConnector } from "../services/apiConnector";
import { url } from "../services/api";
import {utils} from '../services/utils'


import Loader from "../components/loader/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";

import './timeline.css';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import DropzoneCompo from "../components/DropzoneCompo";





const  TaskTimeline = () => {

  //getting id from url query parameter
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('task-id');

  const closeRefThread = useRef();
  const reqForRef =useRef();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [serviceData,setServiceData]=useState({});
  const [taskData,setTaskData]=useState({});
  const [threadData,setThreadData] = useState([]);


  const [refresh,setRefresh]=useState(false);


  //for files upload
  const [formData, setFormData] = useState({
          subject: '',  remarks:'',});

   //setting employee from state
  const employee = useSelector((state) => state.employee);
  const headers = {
        Authorization: `Bearer ${employee.token}`,
      };

// const headersForFile = {
//         Authorization: `Bearer ${employee.token}`,
//         'Content-Type': 'multipart/form-data',
//       };

      const headersForFile = {
        Authorization: `Bearer ${employee.token}`,
    //    'Content-Type': 'multipart/form-data',
      };
  const [taskFiles,setTaskFiles]=useState([]);
  const [threadFiles,setThreadFiles]=useState([]);

  // const [taskFilesEdit,setTaskFilesEdit]=useState([]);

  const { acceptedFiles, getRootProps, getInputProps  } = useDropzone({
      //  accept: ['.pdf', '.csv', '.doc', '.docx', '.xls', '.xlsx'],
        multiple: true,
        onDrop: (acceptedFiles) => {
          const allowedFormats = ['pdf', 'csv', 'doc', 'docx', 'xls', 'xlsx'];
          const invalidFiles = [];
    
          const filteredFiles = acceptedFiles.filter(file => {
            const fileExtension = file.name.split('.').pop();
           
            if (!allowedFormats.includes(fileExtension)) {
              invalidFiles.push(file.name);
              return false; // Filter out invalid files
            }else
              return true; // Keep valid files
          });
    
          if (invalidFiles.length > 0) {
            toast.error('The following files have invalid formats: ' + invalidFiles.join(', '));
          } 
            setTaskFiles(prevFiles => [...prevFiles, ...filteredFiles]);

          
          acceptedFiles=[]

        },
      });
   
     

const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
  

const handleFilesAccepted = (files) => {
    // Handle file acceptance for Form 2
    setThreadFiles([...threadFiles, ...files]);
  };


  //CREATION OF THREAD AND SUBMIT POST CODE
  const handleSubmitThread = async (e) => {
        e.preventDefault();
        const { subject, files , remarks} = formData;

        if (!remarks || remarks.trim() === '') {
          toast.error("Message Required!");
          setLoading(false);
          return false;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('subject', subject);
  
        formDataToSend.append('remarks',remarks);
        // threadFiles.forEach((file) => {
        //   formDataToSend.append('attached', file);
        // });
        try {
                let response = await apiConnector({ 
                        method: "POST",
                        url: `${url}/api/taskassigner/tasks/${id}/threads`,
                    //bodyData: formDataToSend,
                    bodyData:{
                      "subject":subject,
                      "remarks":remarks

                    },

                        headers: headersForFile,
                });
                if (response.status === 201) {
                        setRefresh(!refresh);
                        toast.success("Comment Added successfully");
                         closeRefThread.current.click();
                        reqForRef.current.reset(); 
                        setFormData({  subject: '',
                                 remarks:'',  })
                        setThreadFiles([]);
                }else{
                        toast.error("Not Added, Some Error");
                }
        } catch (error) {
          console.error('Error uploading files:', error);
          toast.error("Not Added, Some Error");
        }
      };


const deleteThreadkAttchment = async (fileToDelete,threadId) => {

        const sure =  window.confirm(`Confirm to delete ${fileToDelete} attchment from Thread? `)
        if(!sure) return false;
         try {
                 let response = await apiConnector({ 
                         method: "put",
                         url: `${url}/api/routingTaskthreadDeleteAttachment/${threadId}`,
                         bodyData: {
                          taskId:serviceData._id,
                          fileName:fileToDelete,
                           updatedBy:employee._id
                         },
                         headers: headers,
                 });
                 if (response.status === 200) {
                         setRefresh(!refresh);
                         toast.success("Attachment deleted successfully");
 
                 }else{
                         toast.error("Error occured");
                 }
         } catch (error) {
           console.error('Error uploading files:', error);
           toast.error("Error: "+ error?.response?.data?.message);
         }
       };

  
const handleRemoveFile = (indexToRemove) => {
        setTaskFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
      };
    
const handleRemoveFileThread = (indexToRemove) => {
      setThreadFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
      };

    
  //fetching Routing task data by Url param id
useEffect(() => {
        const params = {
          method: "GET",
          url: `${url}/api/taskassigner/tasks/${id}`,
          headers: headers,
        }; 
      apiConnector(params)
        .then((response) => {
            setServiceData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching daily progress reports:", error);
          // setLoading(false);
        });

  }, [refresh]);


useEffect(()=>{

        const taskParams = {
                method: "GET",
                url: `${url}/api/taskassigner/tasks/${serviceData?.taskId}/threads`,
                headers: headers,
              }; 

        if(serviceData?.taskId){
            apiConnector(taskParams)
              .then((response) => {
                setThreadData(response.data)
                  
              })
              .catch((error) => {
                console.error("Error fetching daily progress reports:", error);
                // setLoading(false);
              });
        }

},[serviceData]);



const formatDate= (date)=>{
        return moment(date).format('D MMM YYYY h:mm A');
  }



//use for changing the status of task with PENDING(By Default), IN_PROGRESS  & DONE
const handleTestingStatusChange = async (status) => {
    // Handle accept action
    
     const sure =  window.confirm(`Confirm to update the Task Status as ${status}? `)
     if(!sure) return false;
      try {
              let response = await apiConnector({ 
                      method: "PUT",
                      url: `${url}/api/routingTaskStatus/${id}`,
                      bodyData: {
                      statusToChange:status 
                    },
                      headers: headers,
              });
              if (response.status === 200) {
                      setRefresh(!refresh);
                      toast.success("Task Status changed successfully");

              }else{
                      toast.error("Some error occured! "+response?.data?.message);
              }
      } catch (error) {
        console.error('Error uploading files:', error?.response?.data?.message);
        toast.error("Error occured "+error?.response?.data?.message);
      }
  };


const [selectedEmpId,setSelectedEmpId]=useState(null);

  const handleCloseDialog = () => {
    setSelectedEmpId (null);
  }

  const handleEmployeeClick =(empid)=>{
    setSelectedEmpId(empid);
}

  return (
    <Sidebar>
      <div className="container-fluid bdy overflow-x-auto">
      {/* <EmployeeDetailsDialog empid={selectedEmpId} onClose={handleCloseDialog} /> */}
        <div className="timeline">
        
          <div className=" contner right-contner mb-2 min-w-[500px]  ">
            <FontAwesomeIcon
              icon={faCircle}
              className="h-5 text-red-500   img"
            />
            <div className="text-box  text-black shadow-lg border border-red border-solid border-10 ">
              <h2 className="text-md text-black font-bold  text-[#1d3050]">
                 Task Created on {formatDate(serviceData?.createdAt)}
              </h2>
              <small className="font-bold" onClick={()=>handleEmployeeClick(serviceData?.assignedFrom?._id)} >
                Created by {serviceData?.createdBy?.name} 
              </small>
              <br />
              <small className="">
                Last Updated at {formatDate(serviceData?.updatedAt)}
              </small>
              <div className="grid grid-cols-2 gap-0 mt-2">
              <div className="border p-2">
                  
                  <p>   <span className="font-bold">Subject: </span> {serviceData?.subject}</p>
                </div>
               


                <div className="border p-2">
                {/*  */}
                 <p style={{ whiteSpace: 'pre-line' }}>  <span className="font-bold"> Remarks: </span> {serviceData?.remarks}</p>
               </div>

            
            
                <div className="border p-2">
                 
                 <p>  <span className="font-bold"> Assigned To: </span> {serviceData?.assignedToObj?.name}</p>
               </div>
             

                <div className="border p-2">
                 
                  <p>  <span className="font-bold">Testing Status: </span>
                   { utils.resolveTaskStatus(serviceData?.status)}
                   </p>
                </div>
                 
                
              </div>
              { threadData?.length ===0   && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <button
                            type="button"
                            data-toggle="modal"
                            data-target="#addNewReqModa"
                            className="btn btn-primary btn-sm text-white m-2"
                          >
                            Add comment or Reply
                          </button>

                          {    serviceData?.status==='DONE'   &&
                              <button className="btn btn-sm bg-primary text-white  m-2" onClick={()=>handleTestingStatusChange("PENDING")}>Re-Open Task</button>

                          }
                          {    serviceData?.status==='PROGRESS'   &&
                              <button className="btn btn-sm bg-success text-white  m-2" onClick={()=>handleTestingStatusChange("DONE")}>Mark Status Completed</button>

                          }
                          {    serviceData?.status==='PENDING'   &&
                              <button className="btn btn-sm bg-info text-white  m-2" onClick={()=>handleTestingStatusChange("IN_PROGRESS")}>Mark Status in Progress</button>

                          }

                        </div>
                      )}

              <span className="right-contner-arrow"></span>
            </div>
          </div>


      
              {threadData &&
                threadData.map((item, index) => (
                  <div 
                    key={index}
                    className={`mb-2  contner ${
                      index % 2 === 0 ? "right-contner" : "left-contner"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="h-5 text-red-500   img"
                    />
                    <div className="text-box  text-black shadow-lg border border-red border-solid border-10 ">
                      <h2 className="text-md text-black font-bold  text-[#1d3050]">
                        
                        Thread : {formatDate(item?.createdAt)}
                      </h2>
                      {/* <br/><small className="">Last Updated at { formatDate(item?.threadSubject)}</small> */}
                      <div className="grid grid-cols-2 gap-0 mt-1">
                      {item?.subject &&  <div className="border  col-span-2  p-1">
                         
                          <p> Subject :  {item?.subject}</p>
                        </div>}
                        <div className="border col-span-2 p-1">
                          <p className="font-bold">Message: </p>
                          <p>{item?.remarks}</p>
                        </div>

                        { (item?.attachments && item?.attachments?.length !==0) ?       <div className="border col-span-2  p-1">
                         
                          <p>
                          <span className="font-bold"> Attachments: </span>
                            {item?.attachments?.map((file, index) => (
                             <p> <a
                                key={index}
                                href={`${url}/file/thread/${file}`}
                                target="_blank" rel="noreferrer"
                              >
                                {file}
                              </a>   <a className=" ml-3 btn btn-sm bg-red-600 text-white" onClick={()=>{deleteThreadkAttchment(file,item._id)}}> Delete</a> </p>
                            ))}
                          </p>
                        </div> : null  }
                        <div className="border col-span-2  p-1">
                           
                          <small>
                          <span className="font-bold"> From: </span>
                            {item?.createdBy !== null ? (
                              <>
                                
                                {item?.createdBy?.name} 
                                {/* [
                                {item?.createdBy?.role},
                                {item?.createdBy?.email},
                                {item?.createdBy?.phone}] */}
                              </>
                            ) : (
                              "System Genereated"
                            )}
                          </small>
                        </div>
                      </div>

                      {index === threadData.length - 1   && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <button
                            type="button"
                            data-toggle="modal"
                            data-target="#addNewReqModa"
                            className="btn btn-primary btn-sm text-white m-2"
                          >
                            Add comment or Reply
                          </button>

                          {    serviceData?.status==='DONE'   &&
                              <button className="btn btn-sm bg-primary text-white  m-2" onClick={()=>handleTestingStatusChange("PENDING")}>Re-Open Task</button>

                          }
                          {    serviceData?.status==='IN_PROGRESS'   &&
                              <button className="btn btn-sm bg-success text-white  m-2" onClick={()=>handleTestingStatusChange("DONE")}>Mark Status Completed</button>

                          }
                          {    serviceData?.status==='PENDING'   &&
                              <button className="btn btn-sm bg-info text-white  m-2" onClick={()=>handleTestingStatusChange("IN_PROGRESS")}>Mark Status in Progress</button>

                          }

                        </div>
                      )}

                      <span
                        className={` ${
                          index % 2 === 0
                            ? "right-contner-arrow "
                            : "left-contner-arrow "
                        }`}
                      ></span>
                    </div>
                  </div>
                ))}

        </div>

        {/* FORM FOR THREAD CREATION */}
        <div
          className="modal  fade "
          id="addNewReqModa"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="addNewReqModaTitle"
          aria-hidden="true"
          data-backdrop="static"
        >
          <div className="modal-dialog modal-dialog-centered " role="document">
            <form onSubmit={handleSubmitThread} ref={reqForRef}>
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="font-semibold text-xl text-gray-600">
                       Add Comment or Reply
                  </h2>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    ref={closeRefThread}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row    p-1  flex items-center justify-center ">
                    <div className="container  ">
                      <div>
                        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-2 mb-6">
                          <div className="grid gap-4 gap-y-2 text-black text-sm grid-cols-2 ">
                            <div className="md:col-span-6 flex items-center">
                              <label htmlFor="subject" className="">Subject:</label> &nbsp;
                              <input
                                type="text"
                                id="threadSubject"
                                className=" w-5/5 form-control"
                                name="subject"
                                value={formData.threadSubject}
                                onChange={handleInputChange}
                                
                              />
                            </div>

                            <div className="md:col-span-6">
                              <label htmlFor="qualityCategory">
                                Attachments :
                              </label>

                             < DropzoneCompo onFilesAccepted={handleFilesAccepted}/>
                             <ol  className="list-decimal list-inside">
                                {   threadFiles &&
                                  threadFiles.map((file, index) => (
                                   
                                    <li className="" key={file.path}> 
                                      {file.path}  
                                      <span
                                        className="btn btn-sm ml-3 text-white bg-red-600"
                                        onClick={() => handleRemoveFileThread(index)}
                                      >
                                        Remove
                                      </span><br/>
                                    </li> 
                                    
                                  ))}
                              </ol>
                            </div>

                            <div className=" md:col-span-6">
                              <label htmlFor="message">Message:</label>
                              <textarea
                                type="text"
                                id="message"
                                name="remarks"
                                className=" md:col-span-2 form-control"
                                value={formData.threadMessage}
                                onChange={handleInputChange}
                              ></textarea>
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
                    data-dismiss="modal"
                  >
                    Close
                  </button>

                  <button
                    className=" text-md bg-blue-400 flex justify-content  text-white rounded px-4 py-1 font-medium"
                    type="submit"
                  >
                    {loading ? <Loader /> : "SUBMIT"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

      
      
     
     
     
      </div>
    </Sidebar>
  );
};


export default  TaskTimeline;
