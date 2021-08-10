import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Storage from 'local-storage-fallback';
import Item from "./Item";
import { NavLink, useHistory } from "react-router-dom";

function CartPage() {
    const [pList, setPList] = useState();
    const [productMsg, setProductMsg] = useState();
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState();
    const history = useHistory();

    useEffect(() => {
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

    useEffect(() => {
        axios({
            method: "GET",
            url: "/api/checkout/showCartItems",
            headers: { 'x-access-token': Storage.getItem('x-access-token') }
        })
            .then(res => {
                setPList(res.data)
                setLoading(false);
            })
            .catch(err => {
                if (err.response.status === 404) {
                    setProductMsg("محصول پیدا نشد");
                } else if (err.response.status === 401) {
                    setProductMsg("برای اینکار باید وارد سایت شوید")
                } else {
                    setProductMsg(err.response.status + " " + err.response.data)
                }
            })
    })

    const paymentHandler = () => {
        axios({
            method: "POST",
            url: "/api/payments/idpay/",
            headers: {'x-access-token' : Storage.getItem("x-access-token")}
        })
        .then(res => {
            const data = res.data;
            window.location.href = res.data.link
        })
        .catch(err => {
            console.log(err)
        })
    }

    const notLoggedIn = (
        <NotLoggedInDiv>
            <NotLoggedInText>دسترسی این بخش فقط برای افراد میباشد لطفا وارد شوید</NotLoggedInText>
            <NotLoggedInBtn to="/auth">ورود/ثبت نام</NotLoggedInBtn>
        </NotLoggedInDiv>
    );

    const loggedIn = (
        <CartContainer>
            <ItemsSection>
                {loading ? null : pList?.map(item => {
                    return <Item items={item} />
                })}
            </ItemsSection>
            <PaymentSection>
                <Btn onClick={paymentHandler}>پرداخت نهایی</Btn>
            </PaymentSection>
        </CartContainer>
    );


    return (
        <Container>
            {isAuth ? loggedIn : notLoggedIn}
        </Container>
    )
}

export default CartPage;

const Container = styled.div`
    font-family: "samim";
    width: 100%;
    margin-right:15%;
    padding:4rem 0 0 0;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    align-self:center;
    flex-wrap:wrap;
    @media only screen and (max-width: 769px) {
        margin-right:0%;
    }
    
`;

const CartContainer = styled.div`
    width: 80vw;
    height: 500px;
    background-color: ${props => props.theme.ShopCardPadding};
    display: flex;
    flex-direction: row;
`;

const ItemsSection = styled.div`
    width: 60%;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;

`;

const PaymentSection = styled.div`
    width: 40%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

`;

const Btn = styled.button`
    font-family: inherit;
    margin-top:1rem;
    display:flex;
    justify-content:center;
    align-items:center;
    width:250px;
    height:70px;
    border: none;
    border-radius:1rem;
    padding:0.5rem;
    background-color: ${props => props.theme.OrangePurple};
    text-decoration:none;
    color:${props => props.theme.BlackWhite} ;
    font-size:1.375rem;
    cursor: pointer;
`;

const NotLoggedInText = styled.p`
    color: ${props => props.theme.BlackWhite};
    font-family:inherit;
    font-size:1rem;
`;

const NotLoggedInBtn = styled(NavLink)`
    font-family:inherit;
    font-size:1rem;
    margin-top:1rem;
    margin-left:0.3rem;
    padding:.5rem .8rem;
    text-decoration: none;
    outline:none;
    border:none;
    background-color:${props => props.theme.OrangePurple};
    border-radius:0.3rem;
    cursor:pointer;
    color:${props => props.theme.BlackWhite};
`;

const NotLoggedInDiv = styled.div`
    font-family: 'samim';
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;