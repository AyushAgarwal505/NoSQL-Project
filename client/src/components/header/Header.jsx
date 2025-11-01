import {AppBar, styled, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';

const Component = styled(AppBar)`
    background: #FFFFFF;
    color: #000;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    margin-bottom: 0;
    padding-bottom: 0;
`;

const Container = styled(Toolbar)`
    justify-content: center;
    margin-bottom: 0;
    padding-bottom: 0;
    & > a {
        padding: 8px 16px;
        color: #000;
        text-decoration: none;
        
    }
`;
 

const Header = () => {
    return (
        <Component>   
            <Container>
                <Link to="/">HOME</Link>
                <Link to="/about">ABOUT</Link>
                <Link to="/contact">CONTACT</Link>
                <Link to="/login">LOGOUT</Link>
            </Container>
        </Component>
    )
}

export default Header;