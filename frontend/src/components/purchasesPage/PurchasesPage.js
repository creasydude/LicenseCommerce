import { useEffect, useState } from 'react';
import axios from 'axios';
import Storage from 'local-storage-fallback';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

function PurchasesPage() {
    const [isAuth, setIsAuth] = useState();
    const [orders, setOrders] = useState();
    const [orderMsg, setOrderMsg] = useState('');
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
            method: 'GET',
            url: "/api/users/orders",
            headers: { "x-access-token": Storage.getItem("x-access-token") }
        })
            .then(res => {
                setOrders(res.data)
            })
            .catch(err => {
                if (err.response.status === 401) return setIsAuth(false);
                if (err.response.status === 404) return setOrderMsg("هیچ خریدی پیدا نشد")
            })

    }, [isAuth])
    const tables = (
        <Table>
            <thead>
                <TableHead>
                    <THCol1>نام محصول</THCol1>
                    <THCol2>کد</THCol2>
                </TableHead>
            </thead>
            <Tbody>
                {orders?.map(item => {
                    return (
                        <tr>
                            <TDCol1>{item.orderName}</TDCol1>
                            <TDCol2>
                                {item.orderKey?.map(key => {
                                    return <p>{key}</p>
                                })}
                            </TDCol2>
                        </tr>
                    )
                })}
            </Tbody>
        </Table>
    );
    const loggedIn = (
        orderMsg === "" ? tables : <p>{orderMsg}</p>
    );


    const notLoggedIn = (
        <NotLoggedInDiv>
            <NotLoggedInText>دسترسی این بخش فقط برای افراد میباشد لطفا وارد شوید</NotLoggedInText>
            <NotLoggedInBtn to="/auth">ورود/ثبت نام</NotLoggedInBtn>
        </NotLoggedInDiv>
    );
    return (
        <Container>
            
            {isAuth ? loggedIn : notLoggedIn}
        </Container>
    )
}

export default PurchasesPage;

const Container = styled.div`
    padding:2rem;
    margin-right:15%;
    width:100%;
    min-height:500px;
    display:flex;
    justify-content:center;
    align-items:center;
    flex-wrap:wrap;
    @media only screen and (max-width: 769px) {
        margin-right: 0;

    }

    @media screen and (max-width: 992px) {
  & table {
    display: block;
  }
  & table > *, table tr, table td, table th {
    display: block;
  }
  & table thead {
    display: none;
  }
  & table tbody tr {
    height: auto;
    padding: 37px 0;
  }
  & table tbody tr td {
    padding-left: 40% !important;
    margin-bottom: 24px;
  }
  & table tbody tr td:last-child {
    margin-bottom: 0;
  }
  & table tbody tr td:before {
    font-family: 'samim';
    font-size: 14px;
    color: #999999;
    line-height: 1.2;
    font-weight: unset;
    position: absolute;
    width: 40%;
    left: 30px;
    top: 0;
  }
  & table tbody tr td:nth-child(1):before {
    content: "نام محصول";
  }
  & table tbody tr td:nth-child(2):before {
    content: "کد";
  }

  & tbody tr {
    font-size: 14px;
  }
}

`;

const Table = styled.table`
    border-spacing: 1;
    border-collapse: collapse;
    background: white;
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    margin: 0 auto;
    position: relative;

    & * {
        position: relative;
    }

    & td, table th {
        padding-left: 8px;
    }

    & thead tr {
        height: 60px;
        background: ${props => props.theme.OrangePurple};
    }

    & tbody tr {
        height: 50px;
    }
    & tbody tr:last-child {
        border: 0;
    }

    &  td, table th {
        text-align: center;
    }


`;

const TableHead = styled.tr`
    & th {
        font-family: "samim";
        font-size: 18px;
        color: #fff;
        line-height: 1.2;
        font-weight: unset;
    }
`;

const Tbody = styled.tbody`
    & tr:nth-child(even) {
        background-color: #f5f5f5;
    }

    & tr {
        font-family: "samim";
        font-size: 15px;
        color: #808080;
        line-height: 1.2;
        font-weight: unset;
    }

    & tr:hover {
        color: #555555;
        background-color: #f5f5f5;
        cursor: pointer;
    }

`;

const THCol1 = styled.th`
    width: 260px;
    padding-left: 40px;

    @media screen and (max-width: 992px) {
        width: 100%;
    }
`;

const THCol2 = styled.th`
    width: 160px;

    @media screen and (max-width: 992px) {
        width: 100%;
    }
`;

const TDCol1 = styled.td`
    width: 260px;
    padding-left: 40px;

    @media screen and (max-width: 992px) {
        width: 100%;
    }
`;

const TDCol2 = styled.td`
    width: 160px;

    @media screen and (max-width: 992px) {
        width: 100%;
    }
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