import { url } from "../services/api";
import React, { useState, useEffect,useMemo } from "react";

import { apiConnector } from "../services/apiConnector";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  // createRow,
  useMaterialReactTable,
} from 'material-react-table';

import { useSelector } from "react-redux";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,Switch
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
import toast from "react-hot-toast";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
const EmployeeCompo = (props) => {

  // console.log('before top',props)
    // const employee = useSelector((state) => state.employee);

    // const headers = {
    //     Authorization: `Bearer ${employee.token}`,
    //   };

  const [validationErrors, setValidationErrors] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: 'userId',
        header: 'Id',
        enableEditing: false,
        Edit: () => null,
        visibleInShowHideMenu: false,
        size: 10,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'mobileNumber',
        header: 'MobileNumber ',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.mobileNumber,
          helperText: validationErrors?.mobileNumber,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              mobileNumber: undefined,
            }),
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        accessorKey: 'role',
        header: 'Role',
        editVariant: 'select',
        editSelectOptions: ["admin","delegator","executor"],
        muiEditTextFieldProps: {
          select: true,
          required: true,
          error: !!validationErrors?.role,
          helperText: validationErrors?.role,
        },
      },



      {
        accessorKey: 'password_',
        header: 'Password',
        enableEditing: true,
        visibleInShowHideMenu: false,
        // Edit: ({ cell, renderedCellValue }) => <>{"renderedCellValue"}</>,
        muiEditTextFieldProps: {
           
          error: !!validationErrors?.password_,
          helperText: validationErrors?.password_,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              phone: undefined,
            }),
        },
        size: 80,
      },
      {
        accessorFn: (row) =>  row.createdBy, 
        id : 'createdBy',
        header:'CreatedBy',
        enableEditing: false,
        Edit: () => null,
        size:20,
      },

      {
        accessorFn: (row) => new Date(row.createdAt), //convert to Date for sorting and filtering
        id: 'Created_At',
        header: 'Created Date',
        enableEditing: false,
        Edit: () => null,
        filterVariant: 'datetime-range',
        Cell: ({ cell }) => `${cell.getValue().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${cell
          .getValue()
          .toLocaleTimeString()}`,//cell.getValue<Date>()?.toLocaleDateString(), //render Date as a string
        Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
        muiFilterTextFieldProps: {
          sx: {
            minWidth: '150px',
          },
        },
      },
      {
        accessorFn: (row) =>  row.updatedBy, 
        id : 'updatedBy',
        header:'UpdatedBy',
        enableEditing: false,
        Edit: () => null,
        size:20,
      }, 

      {
        accessorFn: (row) => new Date(row.updatedAt), //convert to Date for sorting and filtering
        id: 'Updated_At',
        header: 'Updated Date',
        enableEditing: false,
        Edit: () => null,
        filterVariant: 'datetime-range',
        Cell: ({ cell }) => `${cell.getValue().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${cell
          .getValue()
          .toLocaleTimeString()}`,//cell.getValue<Date>()?.toLocaleDateString(), //render Date as a string
        Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
        muiFilterTextFieldProps: {
          sx: {
            minWidth: '150px',
          },
        },
      },

      {
        accessorKey: 'enabled',
         header: 'Status',
        size: 3,
        enableEditing: false,
        Edit: () => null,
         Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() ===false
                  ? theme.palette.error.dark : theme.palette.success.dark,
              borderRadius: '0.25rem',
              color: '#fff',
             // maxWidth: '9ch',
              p: '0.25rem',
            })}
          >
            {cell.getValue()===true ?"ENABLED":"DISABLED"}
          </Box>
        ),
      },

    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUser();
  //call READ hook

  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers(props.filterRole);
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();

  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();

  //CREATE action
  const handleCreateUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUser(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveUser = async ({ values, table }) => {
    // console.log(values);
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (userId) => {
    deleteUser(userId);
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
    editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    initialState: { density: 'compact', columnVisibility: { userId: false , password_ : false } },
    
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">Create New User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">Edit User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={row.original.enabled?"Enabled" : "Disabled"}>
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row?.original?.userId)}>
            <Switch   checked={row.original.enabled} size="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     "test"
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
         // );
        }}
      >
        Create New User
      </Button>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable table={table}  />;
};

//CREATE hook (post new user to api)
function useCreateUser() {

const employee = useSelector((state) => state.employee);
      const headers = {
      Authorization: `Bearer ${employee.token}`,
      };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      //send api update request here
      try {

        let response = await apiConnector({
          method: "POST",
          url: `${url}/api/taskassigner/users`,
          bodyData: {
            name: user.name,
            email: user.email,
            mobileNumber: user.mobileNumber,
            role: user.role ,
            password: user.password_          },
          headers: headers,
        });

        // Check if the API call was successful
        if (response.status === 201) {
          toast.success("Employee added successfully");
          
        }else{
          toast.error(`Error --${response?.data?.message}`);
        }

        // Simulate a delay (remove this line if not needed)
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        // // Return a resolved Promise
        // return Promise.resolve();
      } catch (error) {
        // Handle errors if necessary
        toast.error(`${error?.response?.data?.errorMessage}`);
        console.error("Error Creating user:", error);
        ///throw error; // Re-throw the error to be caught by onMutate or onSettled
      }


    },
    //client side optimistic update
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(['users'], (prevUsers) => [
        ...prevUsers,
        {
          ...newUserInfo,
          id: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}


function useGetUsers(filterRole) {
    const employee = useSelector((state) => state.employee);
   
    const headers = {
        Authorization: `Bearer ${employee.token}`,
      };
    return useQuery({
      queryKey: ['users'],
      queryFn: async () => {
        // Function to fetch users data
        const fetchUsersData = () => {
          const params = {
            method: "GET",
            url: `${url}/api/taskassigner/users`,
            headers: headers,
          };
          // Returning a promise for the API call
          return apiConnector(params);
        };
  
        try {
          // Call the function to fetch users data
          const response = await fetchUsersData();

          return response.data.users;
        } catch (error) {
          // Handle error
          console.error("Error fetching Users:", error);
          throw new Error(error); // Rethrow the error to be handled by useQuery
        }
      },
      refetchOnWindowFocus: false,
    });
  }

//READ hook (get users from api)
// function useGetUsers() {

//     const params = {
//         method: "GET",
//         url: `${url}/api/getAllEmployees`,
//         headers: headers,
//       };
    
//   return useQuery({
//     queryKey: ['users'],
//     queryFn: async () => {
//       //send api request here
//       await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
//       return Promise.resolve(fakeData);
//     },
//     refetchOnWindowFocus: false,
//   });

  

//   // Call the apiConnector function with the specified parameters
//   apiConnector(params)
//     .then((response) => {
//       // Handle successful response
//       setUsers(response.data);
//       setLoading(false);
//     })
//     .catch((error) => {
//       // Handle error
//       console.error("Error fetching Users:", error);
//       setLoading(false);
//     });


// }

// //UPDATE hook (put user in api)
// function useUpdateUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (user) => {
//       console.log(user);
//       //send api update request here

      
//       await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
//       return Promise.resolve();
//     },
//     //client side optimistic update
//     onMutate: (newUserInfo) => {
//       queryClient.setQueryData(['users'], (prevUsers) =>
//         prevUsers?.map((prevUser) =>
//           prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
//         ),
//       );
//     },
//     onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
//   });
// }

//updated code with custom


// UPDATE hook (put user in api)
function useUpdateUser() {
  const queryClient = useQueryClient();
  const employee = useSelector((state) => state.employee);
        const headers = {
        Authorization: `Bearer ${employee.token}`,
      };
  return useMutation({
    mutationFn: async (user) => {
      try {
        // Call the API to update the user
        
        const response = await apiConnector({
          method: "PUT",
          url: `${url}/api/employee/${user._id}`, // Assuming user._id exists
          bodyData: {
            name: user.name,
            email: user.email,
            phone: user.mobileNumber,
            role: user.role 
          },
          headers: headers,
        });

        // Check if the API call was successful
        if (response.status === 200) {
          toast.success("User updated successfully");
        }

        // Simulate a delay (remove this line if not needed)
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        // // Return a resolved Promise
        // return Promise.resolve();
      } catch (error) {
        // Handle errors if necessary
        toast.error(`${error?.response?.data?.message}`);
        console.error("Error updating user:", error);

        // throw error; // Re-throw the error to be caught by onMutate or onSettled
      }
    },
    // Client side optimistic update
    onMutate: (newUserInfo) => {
      // Optimistically update the user in the local cache
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.map((prevUser) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser
        )
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }) // Refetch users after mutation, disabled for demo
  });
}








//DELETE hook (delete user in api)
function useDeleteUser() {
  const employee = useSelector((state) => state.employee);
        const headers = {
        Authorization: `Bearer ${employee.token}`,
      };
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      try {
        const response = await apiConnector({
          method: "PATCH",
          url: `${url}/api/taskassigner/users/status-change/${userId}`, // Assuming user._id exists
          headers: headers,
        });

        // Check if the API call was successful
        if (response.status === 200) {
         
          toast.success(`${response?.data?.statusMsg}`);
        }else{
          toast.error("Some error occured!")
        }
      } catch (error) {
        toast.error(`Error : ${error?.response?.data?.message}`);
      }

    },
    onMutate: (userId) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.filter((user) => user.userId !== userId),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const ExampleWithProviders = ( props ) => (
    
  //Put this with your other react-query providers near root of your app
  <LocalizationProvider dateAdapter={AdapterDayjs}   >
  <QueryClientProvider client={queryClient}>
    <EmployeeCompo filterRole={props.filterRole}/>
  </QueryClientProvider>
  </LocalizationProvider>
);

export default ExampleWithProviders;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateUser(user) {
  return {
    name: !validateRequired(user.name)
      ? 'First Name is Required'
      : '',
    phone: !validateRequired(user?.mobileNumber) ? 'Mib Name is Required' : '',
    email: !validateEmail(user?.email) ? 'Incorrect Email Format' : '',
    role: !validateRequired(user?.role)?'Choose Role':''
  };
}


