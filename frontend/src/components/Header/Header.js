import { useState , useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from "react-icons/md";
import { IconContext } from "react-icons";
import axios from 'axios';
import Storage from 'local-storage-fallback';

//Components 
import SideDrawer from '../SideDrawer/SideDrawer';
import DropDown from '../DropDown/DropDown';


function Header(props) {
    const [menuToggle, setMenuToggle] = useState(false);
    const showSideDrawer = () => setMenuToggle(!menuToggle);

    const [ddToggle, setDdToggle] = useState(false);
    const showDd = () => setDdToggle(!ddToggle);
    const [cardItems, setCardItem] = useState();

    useEffect(() => {
        axios({
            method: "GET",
            url: "/api/checkout/showCartItems/",
            headers: {"x-access-token" : Storage.getItem("x-access-token")}
        })
        .then(res => {
            let cardItemsArr = res.data
            setCardItem(cardItemsArr.length)
        })
        .catch(err => {
            if(err.response.status === 401) {
                setCardItem(0)
            }else if (err.response.status === 404) {
                setCardItem(0)
            }
        })
    })

    return (
        <H>
            <SideDrawer sdToggleActive={showSideDrawer} sdToggle={menuToggle} darkModeToggle={props.darkModeToggle} themeStatus={props.themeStatus} />
            <Hul>
                <IconContext.Provider value={{ size: '2.8125rem', className: 'rIcon' }} >
                    <Hli>
                        <FaIcons.FaBars onClick={showSideDrawer} className="hIcon" />
                    </Hli>
                    <Hli>
                        <Link to="/">
                            LOGO
                        </Link>
                    </Hli>
                    <Hli onClick={showDd} className={ddToggle ? "DdActive" : "DdDisActive"}>
                        <MdIcons.MdExpandLess className="hIcon" />
                    </Hli>
                    <Hli>
                        <HddItems to="/what-is-giftcard">
                            گیفت کارت چیست؟
                        </HddItems>
                    </Hli>
                    <Hli>
                        <HddItems to="/faq">
                            سوالات متداول
                        </HddItems>
                    </Hli>
                    <Hli>
                        <HddItems to="/contact-us">
                            تماس با ما
                        </HddItems>
                    </Hli>
                    <Hli>
                        <HddItems to="/learn">
                            آموزش ها
                        </HddItems>
                    </Hli>
                    <Hli>
                        <CartLink to="/cart">
                            <Hcart>
                                <span>{cardItems}</span>
                                <FaIcons.FaShoppingCart className="hIcon" />
                            </Hcart>
                        </CartLink>
                    </Hli>
                </IconContext.Provider>
            </Hul>
            <DropDown ddT={ddToggle} />
        </H>
    )
}

export default Header;


const H = styled.header`
    width:100%;
    padding-top:0.7rem;
    margin-right: 15%;
    @media only screen and (max-width: 769px) {
        margin-right: 0;
    }
    
`;

const Hul = styled.ul`
    list-style-type:none;
    display: flex;
    flex-direction:row;
    justify-content:space-between;
    align-items: center;
    align-content: space-between;
    
`;

const Hli = styled.li`
    padding:0.7rem;
    cursor: pointer;

    &:nth-child(1) {
        display:none;
        @media only screen and (max-width: 769px) {
        display:block;
    }
    }
    &:nth-child(2) {
        display:none;
        @media only screen and (max-width: 769px) {
        display:block;
    }
    }
    &:nth-child(3) {
        display:none;
        @media only screen and (max-width: 769px) {
        display:block;
    }
    }
    &:nth-child(4) {
        padding-right:2rem;
        display:block;
        @media only screen and (max-width: 769px) {
        display:none;
    }
    }
    &:nth-child(5) {
        display:block;
        @media only screen and (max-width: 769px) {
            display:none;
    }
    }
    &:nth-child(6) {
        display:block;
        @media only screen and (max-width: 769px) {
        display:none;
    }
    }
    &:nth-child(7) {
        display:block;
        @media only screen and (max-width: 769px) {
        display:none;
    }
    }

    &:nth-child(3).DdActive {
        transform:rotate(180deg);
        transition:transform 0.5s;
    }

    &:nth-child(3).DdDisActive {
        transform:rotate(0deg);
        transition:transform 0.5s;
    }

`;

const Link = styled(NavLink)`
    font-family: 'samim';
    font-weight: bold;
    font-size:1.5rem;
    color: ${props => props.theme.BlackGray};
    text-decoration:none;

`;

const Hcart = styled.div`
    display:flex;
    justify-content:center;
    align-content:center;
    align-items:center;
    background-color: ${props => props.theme.ShopCardPadding};
    padding:0.2rem;
    border-radius:0.5rem;

    & span {
        border-radius : 0.5rem;
        width:25px;
        height:25px;
        background-color: ${props => props.theme.OrangePurple};
        display:flex;
        justify-content:center;
        align-items:center;
        align-content:center;
    }

    & :last-child {
        margin-right:0.5rem;
        padding:0.6rem;
    }

`;

const HddItems = styled(NavLink)`
    font-family:'samim';
    color : ${props => props.theme.GrayGrayR};
    text-decoration:none;

    &.active {
        color: ${props => props.theme.BlackWhite} ;
        border-bottom: 2px solid ${props => props.theme.OrangePurple};
    }
`;

const CartLink = styled(NavLink)`
    text-decoration: none;
    color: ${props => props.theme.BlackWhite};
`;