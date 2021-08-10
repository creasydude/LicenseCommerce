import React from 'react'
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const Dd = styled.div`
    width:100vw;
    min-height:1px;
    border-radius:0.4rem;
    background-color: ${props => props.theme.ShopCardPadding};
    text-align:center;
    position: fixed;
    top:5rem;
    z-index:1;

    &.Active {
        visibility: visible;
        opacity: 1;
        transition: visibility 0.5s, opacity 0.5s linear;
        

    }
    &.DeActive {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0.5s, opacity 0.5s linear;

    }
`;

const DdUl = styled.ul`
    padding:3rem;
    list-style-type:none;

`;

const DdLi = styled.li`
    padding:1rem;
`;

const Link = styled(NavLink)`
    font-family: 'samim';
    font-weight:bold;
    text-decoration:none;
    color: ${props => props.theme.GrayGrayR} ;

    &.active {
        color: ${props =>props.theme.BlackWhite} ;
        border-bottom: 2px solid ${props =>props.theme.OrangePurple};
    }

`;

function DropDown(props) {
    return (
        <Dd className={props.ddT ? 'Active' : 'DeActive'}>
            <DdUl>
                <DdLi>
                    <Link to="what-is-giftcard">
                        گیفت کارت چیست؟
                    </Link>
                </DdLi>
                <DdLi>
                    <Link to="faq">
                        سوالات متداول
                    </Link>
                </DdLi>
                <DdLi>
                    <Link to="contact-us">
                        تماس با ما
                    </Link>
                </DdLi>
                <DdLi>
                    <Link to="learn">
                        آموزش ها
                    </Link>
                </DdLi>
            </DdUl>
        </Dd>
    )
}

export default DropDown;
