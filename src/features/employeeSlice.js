// authSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'
import {toast} from 'react-hot-toast';
import {url} from '../services/api'



const initialState = {
    token: sessionStorage.getItem('token'),
    name: sessionStorage.getItem('name'),
    email: sessionStorage.getItem('email'),
    role: '',
    _id: '',
    category:sessionStorage.getItem('category'),
};

export const loginemployee = createAsyncThunk(
    "employee/loginemployee",
    async (employee) => {
        try {
            const res = await axios.post(`${url}/api/taskassigner/users/login`, {
                email: employee.email,
                password: employee.password
            });
            
            if (res.status===200) {
                toast.success("Login Successful");
                 console.log(res.data.message);
                sessionStorage.setItem('token', res.data.message);
            }

            return res.data.message;
        } catch (error) {
            toast.error(`Error : ${error?.response?.data?.message}`)
        }
    }
)

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        loademployee(state, action) {
            const token = state.token
            if (token) {
                const decodedToken = jwtDecode(token);
                return {
                    ...state,
                    token,
                    _id: decodedToken.sub,
                    email: decodedToken.email,
                    role: decodedToken.role,                    
                };
            }
        },
        logoutemployee(state, action) {
            sessionStorage.removeItem('token');

            return {
                ...state,
                token: "",
                name: "",
                email: '',
                role: '',
                _id: '',
                category:null
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginemployee.fulfilled, (state, action) => {
            if (action.payload) {
                const decodedToken = jwtDecode(action.payload);
                return {
                    ...state,
                    token: action.payload,
                    _id: decodedToken.sub,
                    email: decodedToken.email,
                    role: decodedToken.role,   
                }
            }
            else {
                return state
            }
        });
    }
});

export const { loademployee, logoutemployee } = employeeSlice.actions
export default employeeSlice.reducer