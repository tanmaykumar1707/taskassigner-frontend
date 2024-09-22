import { useMemo,useState,useEffect } from 'react';
import { useSelector } from "react-redux";


import { apiConnector } from "../services/apiConnector";
import { url } from "../services/api";

import { useNavigate, useParams } from 'react-router-dom';
import toast from "react-hot-toast";
//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  // MRT_GlobalFilterTextField,
  // MRT_ToggleFiltersButton,
} from 'material-react-table';

//Material UI Imports
import {
  Box,
  // Button,
  ListItemIcon,
  MenuItem,
  // Typography,
  // lighten,
} from '@mui/material';

import { AccountCircle, Send, Delete } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


const TaskCompo = (props) => {
  const navigate = useNavigate();
  const employee = useSelector((state) => state.employee);
  const headers = {
      Authorization: `Bearer ${employee.token}`,
    };

  const columns = useMemo(
    () => [
           {
            accessorKey:'subject',
            header: 'Subject',
            size: 30,
          },
      
          {
            accessorKey: 'status', 
            header: 'Status',
            size: 10,
          },
      
          {
            accessorFn: (row) =>  !row.assignedTo ? "NOT ASSGINED" : row.assignedToObj?.name , //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            id:'assignedTo',
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'Assigned Executor',
            size: 30,
          },
        
          {
            accessorKey: 'remarks',
            header: 'Remarks',
            size: 30,

          },

          {
            accessorFn: (row) =>  row.assignedFrom?.name  ,
            id:'assignedFrom',
            header: 'AssignedFrom',
            size: 30,

          },
         
           
          {
            accessorFn: (row) => new Date(row.updatedAt), //convert to Date for sorting and filtering
            id: 'updateDt',
            header: 'Updated Date',
            filterVariant: 'date',
            filterFn: 'lessThan',
            sortingFn: 'datetime',
          //  Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
          Cell: ({ cell }) => `${cell.getValue().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${cell
            .getValue()
            .toLocaleTimeString()}`,
            Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
            muiFilterTextFieldProps: {
              sx: {
                minWidth: '150px',
              },
            },
          },
          {
            accessorFn: (row) => new Date(row.createdAt), //convert to Date for sorting and filtering
            id: 'createdDt',
            header: 'Created Date',
            filterVariant: 'date',
            filterFn: 'lessThan',
            sortingFn: 'datetime',
          //  Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
            Cell: ({ cell }) => `${cell.getValue().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${cell
              .getValue()
              .toLocaleTimeString()}`,
            Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
            muiFilterTextFieldProps: {
              sx: {
                minWidth: '150px',
              },
            },
          },
        
    ],
    [],
  );

  const [reload,setReload]=useState(false);
  const [allAccounts, setAllAccounts] = useState([]);

  

  useEffect(() => {
      const params = {
        method: "GET",
        url: (props?.fetchType==='ASSIGNED_TO_ME') ?  `${url}/api/taskassigner/tasks` :  `${url}/api/taskassigner/tasks` ,
     //   url:  `${url}/api/routingtask`,

        headers: headers,
      };
    apiConnector(params)
      .then((response) => {
        // if(employee.role==='admin')
        //   setAllAccounts(response.data);
        // else{
          // console.log("filterd ", response.data.filter((acc) => acc.accountId?._id === props?.accountIdProps))
          // setAllAccounts( response.data.filter((acc) => acc.accountId?._id === props?.accountIdProps));

          if(props?.fetchType==='ASSIGNED_FROM_ME'){
            setAllAccounts(response.data);
           // setAllAccounts( response.data.filter((acc) => acc.assignedFrom?._id === employee._id));
          }else{
            setAllAccounts(response.data);
          }
        // }
      })
      .catch((error) => {
        console.error("Error fetching daily progress reports:", error);
        // setLoading(false);
      });
    }, [props?.reload,reload]);


  const table = useMaterialReactTable({
    columns,
    data:allAccounts, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnFilterModes: true,//showing multiple filter options
    enableColumnOrdering: true,
    enableGrouping: false,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true, // view profile others
    enableRowSelection: false,
    initialState: {
      density: 'compact',
      showColumnFilters: false,
      showGlobalFilter: true,
      // columnVisibility: { ghostVisibility: employee.role==='admin'?true:false , ghostPricing : employee.role==='admin'?true:false },
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    muiSearchTextFieldProps: {
      size: 'small',
      variant: 'outlined',
    },
    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [10, 20, 30],
      shape: 'rounded',
      variant: 'outlined',
    },
   
    muiTableBodyRowProps: ({ row ,theme}) => ({
      //conditionally style selected rows
      sx: {
        fontWeight:'bold',// row.getIsSelected() ? 'bold' : 'normal',
        backgroundColor: row?.original?.taskStatus==="DONE"?'#24A148' : 
        row?.original?.taskStatus==="PENDING"? 'rgba(218, 30, 40, 0.4)' : 
        row?.original?.taskStatus==="IN_PROGRESS"?  'rgb(173, 216, 230)' : 
        '#FFFFE0'
      },
    }),
  
    renderRowActionMenuItems: ({ closeMenu,row }) => [
      <MenuItem
        key={0}
        onClick={() => {
          navigate(`/task-threads?task-id=${row?.original?.taskId}`);
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
           View Thread Task
      </MenuItem>,
      <MenuItem
        key={1}
        onClick={() => {

          if(employee.role==='NOC Manager'){
            alert("Not Allowed");
            closeMenu();
            return false;
          }

          props?.setserviceEditData(row.original);
          props?.openModal.current.click();

          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Send />
        </ListItemIcon>
           Edit
      </MenuItem>,
    
  

      <MenuItem
      key={4}
      onClick={() => {

        if(employee.role==='NOC Manager'){
          alert("Not Allowed");
          closeMenu();
          return false;
        }

        handleDeleteReq(`${row?.original?.taskId}`);
        closeMenu();
      }}
      sx={{ m: 0 }}
      >
      <ListItemIcon>
        <Delete />
      </ListItemIcon>
      Delete 
      </MenuItem>,
     
    
    ],
    
  });



  

 const handleDeleteReq = async(idToDelete)=>{
      const confirm = window.confirm("Confirm to delete the selected Route?")
      if(!confirm)
        return false;
    try {
      const response = await apiConnector({
        method: "DELETE",
        url: `${url}/api/taskassigner/tasks/${idToDelete}`,  
        headers: headers,
      });

      // Check if the API call was successful
      if (response.status === 200) {
        toast.success(`${response?.data?.statusMsg}`);
        setReload(!reload) ;
      }else{
        toast.error("Some error occured!")
      }
    } catch (error) {
      toast.error(`Error : ${error?.response?.data?.message}`);
    }
  }


  return (<>  

  <MaterialReactTable table={table} /> </>);
};



const ExampleWithLocalizationProvider = (accountIdProps) => (
  //App.tsx or AppProviders file
 
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <TaskCompo 
    fetchType={accountIdProps?.fetchType} 
    reload={accountIdProps?.reload} openModal={accountIdProps?.openModal}
      serviceEditData={ accountIdProps?.serviceEditData} setserviceEditData={accountIdProps?.setserviceEditData}
      // setShowGhostPriceBox={ accountIdProps?.setShowGhostPriceBox}
    />
  </LocalizationProvider>
);

export default ExampleWithLocalizationProvider;


 