import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Storage from 'local-storage-fallback';
import { NavLink, useHistory } from "react-router-dom";

function Result() {
    const [msg, setMsg] = useState();
    const history = useHistory()
    useEffect(() => {
        axios({
            method: "GET",
            url: "/api/payments/callback",
            headers: { 'x-access-token': Storage.getItem('x-access-token') },
        })
            .then(res => {
                setMsg("پرداخت شما موفقیت آمیز بود")
                setTimeout(() => {
                    history.push('/purchases')
                }, 2000);
            })
            .catch(err => {
                setMsg("پرداخت شما با مشکل مواجه بود")
            })
    })
    return (
        <Container>
            <DIV>
                <TEXT>{msg}</TEXT>

            </DIV>
        </Container>
    )
}

export default Result;

const Container = styled.div`
    margin-right: 15%;
    width: 100%;

`;

const TEXT = styled.p`
    padding-top: 2rem;
    color: ${props => props.theme.BlackWhite};
    font-family:inherit;
    font-size:1rem;
`;

const DIV = styled.div`
    font-family: 'samim';
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;