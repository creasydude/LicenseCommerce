import styled from 'styled-components';
import particlesJs from '../particlesJs';
import giftCard from '../../assets/img/giftcard.svg';
import { NavLink } from 'react-router-dom';

const C = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
    font-family:'samim';
    width:100%;
    min-height:500px;
    padding:1rem;
    margin-right:15%;
    @media only screen and (max-width: 769px) {
        margin-right: 0;

        & img {
            width:75%;
        }
    }

    & img {
        margin-bottom:2rem;
    }

    & p {
        padding-top:0.5rem;
        color :${props => props.theme.BlackWhite} ;
    }

    & p:nth-of-type(1) {
        padding-left:10rem;

    }
    & p:nth-of-type(2) {
        padding-right:10rem;

    }
    & p:nth-of-type(3) {
        padding-left:10rem;

    }
    & p:nth-of-type(4) {
        padding-right:10rem;

    }
    
`;

const Btn = styled(NavLink)`
    margin-top:1rem;
    display:flex;
    justify-content:center;
    align-items:center;
    width:250px;
    height:70px;
    border-radius:1rem;
    padding:0.5rem;
    background-color: ${props =>props.theme.OrangePurple};
    text-decoration:none;
    color:${props => props.theme.BlackWhite} ;
    font-size:1.375rem;
`;

const PJS = styled(particlesJs)``;

function Content() {
    return (
        <C>
            <PJS />
            <img src={giftCard} />
            <p>داخل سایت ثبت نام کنید / وارد شوید</p>
            <p>محصول مورد نظر را انتخاب کنید</p>
            <p>خرید کنید و به صورت آنی تحویل بگیرید</p>
            <p>به همین سادگی!!</p>
            <Btn to='/category'>ورود به دسته بندی</Btn>
        </C>
    )
}

export default Content
