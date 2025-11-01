import { useState, useContext } from 'react';
import { Box, TextField, Button, styled, Typography } from "@mui/material";
import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';
import { useNavigate } from 'react-router-dom';

const Component = styled(Box)`
    width: 400px;
    margin: auto;
    box-shadow: 5px 2px 5px 2px rgb(0 0 0 / 0.6);
`;

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    padding: 25px 35px;
    & > div, & > button, & > p {
        margin-top: 20px;
    }
`;

const LoginButton = styled(Button)`
    text-transform: none;
    background: #FB641B;
    color: #fff;
    height: 48px;
    border-radius: 2px;     
`;

const SignupButton = styled(Button)`
    text-transform: none;
    background: #fff;
    color: #2874f0;
    height: 48px;
    border-radius: 2px;     
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
`;

const Text = styled(Typography)`
    font-size: 14px;
    color: #878787;
`;  

const Error = styled(Typography)`
    font-size: 10px;
    color: #ff6161;
    line-height: 0;
    margin-top: 10px;
    font-weight: 600;
`;

// ⬇️ Signup fields (optional: name, country, city)
const signupInitialValues = {  
    name: '',
    username: '',
    password: '',
    country: '',
    city: ''
};

const loginInitialValues = {
    username: '',
    password: ''    
};

const Login = ({ isUserAuthenticated }) => {
    const [account, toggleAccount] = useState('login');
    const [signup, setSignup] = useState(signupInitialValues); 
    const [login, setLogin] = useState(loginInitialValues);
    const [error, setError] = useState('');
    const { setAccount } = useContext(DataContext);
    const navigate = useNavigate();

    const toggleSignup = () => {
        account === 'signup' ? toggleAccount('login') : toggleAccount('signup');
    }

    const onInputChange = (e) => {
        setSignup({ ...signup, [e.target.name]: e.target.value });
    }   

    const signupUser = async () => {
        // Remove empty optional fields
        const payload = Object.fromEntries(
            Object.entries(signup).filter(([_, v]) => v !== '')
        );

        let response = await API.userSignup(payload);
        if (response.isSuccess) {
            setError('');
            setSignup(signupInitialValues);
            toggleAccount('login');
        } else {
            setError(response?.msg || 'Something went wrong! Please try again later.');
        }
    }

    const onValueChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    }

    const loginUser = async () => {
        let response = await API.userLogin(login);
        if (response.isSuccess) {
            setError('');
            sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
            sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
            setAccount({
                username: response.data.username,
                name: response.data.name
            });
            isUserAuthenticated(true);
            navigate('/');
        } else {
            setError(response?.msg || 'Something went wrong! Please try again later.');
        }
    }

    return (
        <Component>
            <Box>
                {
                    account === 'login' ?   
                        <Wrapper>
                            <TextField
                                variant="standard"
                                value={login.username}
                                onChange={onValueChange}
                                name="username"
                                label="Username"
                            />
                            <TextField
                                variant="standard"
                                value={login.password}
                                onChange={onValueChange}
                                name="password"
                                label="Password"
                                type="password"
                            />
                            {error && <Error>{error}</Error>}
                            <LoginButton variant="contained" onClick={loginUser}>
                                Login
                            </LoginButton>
                            <Text style={{ textAlign: 'center' }}>OR</Text>
                            <SignupButton onClick={toggleSignup}>
                                Create an account
                            </SignupButton>
                        </Wrapper>
                    :
                        <Wrapper>
                            {/* Optional fields first */}
                            <TextField
                                variant="standard"
                                onChange={onInputChange}
                                name="name"
                                label="Name (optional)"
                            />
                            <TextField
                                variant="standard"
                                onChange={onInputChange}
                                name="username"
                                label="Username"
                            />
                            <TextField
                                variant="standard"
                                onChange={onInputChange}
                                name="password"
                                label="Password"
                                type="password"
                            />
                            <TextField
                                variant="standard"
                                onChange={onInputChange}
                                name="country"
                                label="Country (optional)"
                            />
                            <TextField
                                variant="standard"
                                onChange={onInputChange}
                                name="city"
                                label="City (optional)"
                            />
                            {error && <Error>{error}</Error>}
                            <SignupButton onClick={signupUser}>
                                Sign Up
                            </SignupButton>
                            <Text style={{ textAlign: 'center' }}>OR</Text>
                            <LoginButton variant="contained" onClick={toggleSignup}>
                                Already have an account
                            </LoginButton>
                        </Wrapper>
                }
            </Box>
        </Component>
    );
}

export default Login;
