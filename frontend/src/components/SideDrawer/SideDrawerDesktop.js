import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from "react-icons/md";
import { IconContext } from "react-icons";
import { useState, useEffect } from 'react';
import Storage from 'local-storage-fallback';
import axios from 'axios';

function SideDrawerDesktop(props) {
    const Logo = "LOGO";
    let { pathname } = useLocation();
    const [isAuth, setIsAuth] = useState();
    useEffect(async () => {
        axios({
            method: 'POST',
            url: "/api/users/isAuth",
            data: {
                token: Storage.getItem("x-access-token"),
            }
        })
            .then(res => {
                setIsAuth(res.data.isAuth);
            })
            .catch(err => {
                if (err.response.status == 400) {
                    setIsAuth(false)
                } else {
                    setIsAuth(false)
                }
            })
    })

    const logoutHandler = () => {
        Storage.removeItem("x-access-token")
    }

    const LoggedIn = (
        <SdLogin>
            <img src="https://p.kindpng.com/picc/s/348-3481623_i-chen-avatar-icon-hd-png-download.png" />
            <SdLoginI>
                <Link to="/profile">
                    پروفایل
                </Link>
                <Link onClick={logoutHandler} to="/">
                    خروج
                </Link>
            </SdLoginI>
        </SdLogin>
    );
    const NotLoggedIn = (

        <SdLoginI>
            <Link className={pathname === "/auth" || pathname === "/forgot-password" ? "aIcon" : "rIcon"} style={{ fontSize: "1rem" }} to="/auth">
                ورود / ثبت نام
                {pathname === "/auth" || pathname === "/forgot-password" ? <ActiveDiv /> : null}
            </Link>
        </SdLoginI>

    );
    return (
        <Sd>
            <IconContext.Provider value={{ size: '2.8125rem' }} >
                <SdNavbar>
                    {/* LOGO */}
                    <SdLogo to="/">
                        {Logo}
                    </SdLogo>
                    <SdUl>
                        <SdLi>
                            <Link exact to="/">
                                <MdIcons.MdStore className={pathname === "/" ? "aIcon" : "rIcon"} />
                                <span className={pathname === "/" ? "aIcon" : null}>فروشگاه</span>
                                {pathname === "/" ? <ActiveDiv /> : null}
                            </Link>
                        </SdLi>
                        <SdLi>
                            <Link exact to="category">
                                <FaIcons.FaList className={pathname === "/category" ? "aIcon" : "rIcon"} />
                                <span className={pathname === "/category" ? "aIcon" : null}>دسته بندی</span>
                                {pathname === "/category" ? <ActiveDiv /> : null}
                            </Link>
                        </SdLi>
                        <SdLi>
                            <Link exact to="purchases">
                                <MdIcons.MdRemoveRedEye className={pathname === "/purchases" ? "aIcon" : "rIcon"} />
                                <span className={pathname === "/purchases" ? "aIcon" : null}>خرید ها</span>
                                {pathname === "/purchases" ? <ActiveDiv /> : null}
                            </Link>
                        </SdLi>
                        <SdLi>
                            <SdThemeDiv onClick={props.darkModeToggle}>
                                {props.themeStatus.mode === 'dark' ? <FaIcons.FaToggleOn className="rIcon" /> : <FaIcons.FaToggleOff className="rIcon" />}
                                <span>تم سایت</span>
                            </SdThemeDiv>
                        </SdLi>
                    </SdUl>
                    {isAuth ? LoggedIn : NotLoggedIn}
                </SdNavbar>
            </IconContext.Provider>
        </Sd>
    )
}

export default SideDrawerDesktop;

const Sd = styled.nav`
    font-family: 'samim';
    margin:0;
    padding:0;
    overflow:hidden;
    @media only screen and (max-width: 769px) {
    display:none;
    }
`;

const SdNavbar = styled.div`
    padding-top:1.2rem;
    padding-right:0.7rem;
    width: 15%;
    height: 100vh;
    border-left: 1px solid ${props => props.theme.GrayWhite};
    top: 0;
    right: 0;
    position:fixed;
    /* right:-100%; */
    background-color: ${props => props.theme.BackGround};
    top:0;
    cursor: default;
    list-style-type:none;
    display:grid;
    grid-template-rows: 1fr 5fr 1fr;
    transition: right 0.5s;
    z-index:2;
`;

const SdUl = styled.ul`
    list-style-type:none;
`;

const SdLi = styled.li`
    padding-top:4rem;
`;

const Link = styled(NavLink)`
    text-decoration:none;
    font-weight:bold;
    color : ${props => props.theme.GrayGray};
    display:flex;
    align-items: center;
    & > span {
        padding-right:2rem;
        
    }
`;

const SdThemeDiv = styled.div`
    display:flex;
    align-items:center;
    & > span {
        padding-right:2rem;
        color:${props => props.theme.GrayGray};
        cursor: pointer;
    }
`;

const SdLogin = styled.div`
    width:45px;
    height:45px;
    display:flex;
    flex-direction:row;

    & img {
        width:100%;
        border-radius:50%;
        cursor: pointer;
    }

`;

const SdLoginI = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    padding-right:0.75rem;

    ${Link} {
        font-size:.75rem;
    }
`;

const ActiveDiv = styled.div`
    position: absolute;
    display: inline-block;
    right:100%;
    height: 2.8125rem;
    cursor: default !important;
    border-right: 1px solid ${props => props.theme.OrangePurple};
`;

const SdLogo = styled(NavLink)`
    color: ${props => props.theme.BlackGray};
    font-size: 1.5rem;
    font-weight:bold;
    padding:1rem 1rem 0rem 0rem;
    text-decoration:none;
`;