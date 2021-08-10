import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import Storage from 'local-storage-fallback';
import axios from 'axios';
import { NavLink } from 'react-router-dom';


function UserProfile(props) {
    const [user, setUser] = useState();
    const history = useHistory();
    useEffect(() => {
        axios({
            method: "GET",
            url: "/api/users/profile",
            headers: { "x-access-token": Storage.getItem("x-access-token") }
        })
            .then(res => {
                setUser(res.data)
            })
            .catch(err => {
                if (err.response.status === 400) {
                    history.push('/auth')
                } else {
                    history.push('/auth')
                }
            })
    }, [history])
    return (
        <C>
            <ProfileBox>
                <SideBox>
                    <h4>LOGO</h4>
                </SideBox>
                <AsideBox>
                    <h1>پروفایل</h1>
                    <h4>خوش آمدید</h4>
                    <h4>{user?.email}</h4>
                    <Button to="/">برو به فروشگاه</Button>
                </AsideBox>
            </ProfileBox>
        </C>
    )
}

export default UserProfile;

const C = styled.div`
    width:100%;
    min-height:500px;
    margin-right:15%;
    padding:2rem;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    align-self:center;
    font-family: 'samim';

    @media only screen and (max-width: 769px) {
        margin-right:0;
        
    }

    & p {
        color: ${props => props.theme.BlackWhite};
    }

`;

const ProfileBox = styled.div`
    position:relative;
    width:900px;
    height:500px;
    background-color: ${props => props.theme.ShopCardPadding};
    display:flex;
    flex-direction:row;
    overflow:hidden;

    @media only screen and (max-width: 769px) {
        width:100%;
    }
`;

const SideBox = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-content:center;
    align-items:center;
    width:300px;
    height:100%;
    background-color: ${props => props.theme.OrangePurple} ;

    & h4 {
        font-size:2rem;
        color: ${props => props.theme.BlackWhite};
    }

    & h4:hover {
        text-decoration:underline;
    }

    @media only screen and (max-width: 769px) {
        display:none;
    }
`;

const AsideBox = styled.div`
    width:600px;
    height:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    color: ${props => props.theme.BlackWhite};

    & img {
        margin-top:1rem;
        width :65px;
        height:65px;
        border-radius:50%;
        cursor: pointer;
    }

    @media only screen and (max-width: 769px) {
        width:100%;
    }
`;

const Button = styled(NavLink)`
    font-family:inherit;
    font-size:1rem;
    margin-top:1rem;
    margin-left:0.3rem;
    padding:.5rem .8rem;
    outline:none;
    border:none;
    text-decoration: none;
    background-color:${props => props.theme.OrangePurple};
    border-radius:0.3rem;
    cursor:pointer;
    color:${props => props.theme.BlackWhite};

`;