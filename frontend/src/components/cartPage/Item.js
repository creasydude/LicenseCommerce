import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Storage from 'local-storage-fallback';
import { useHistory } from "react-router-dom";

function Item({ items }) {
    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(items?.productQty);
    const [msg, setMsg] = useState('');
    const history = useHistory();
    useEffect(() => {
        axios({
            method: "GET",
            url: `/api/products/id/${items?.productId}`,
        })
            .then(res => {
                setProduct(res.data)
                setLoading(false);
            })
            .catch(err => {
                setProduct({
                    name: "Nothing Found",
                })
            })
    }, [items])
    useEffect(() => {
        axios({
            method: "PUT",
            url: "/api/checkout/updateQty/",
            headers: { 'x-access-token': Storage.getItem('x-access-token') },
            data: {
                _id: items._id,
                productQty: qty,
            },
        })
            .then(res => {

            })
            .catch(err => {
                if (err.response.status === 404) {
                    setLoading(true);
                } else {
                    setLoading(true);
                }
            })
    }, [qty])
    const deleteCartHandler = () => {
        axios({
            method: "DELETE",
            url: "/api/checkout/deleteFromCart",
            headers: { 'x-access-token': Storage.getItem('x-access-token') },
            data: {
                _id: items._id,
            },
        })
            .then(res => {
                history.go(0)
            })
            .catch(err => {
                if (err.response.status === 404) {
                    setLoading(true);
                } else {
                    setLoading(true);
                }
            })
    }
    return (
        <Container>
            {loading ? null : (
                <Fragment>
                    <ItemDetails>{product?.name}</ItemDetails>
                    <ItemDetails>
                        <Quantity onChange={(e) => { setQty(e.target.value); }} autoComplete="off" type="number" min="1" max="100" defaultValue={qty} />
                    </ItemDetails>
                    <ItemDetails>{items?.productQty * product?.price} ریال</ItemDetails>
                    <ItemDetails onClick={deleteCartHandler}><span>X</span></ItemDetails>
                </Fragment>
            )}
        </Container>
    )
}

export default Item;

const Container = styled.div`
    width: 100%;
    display: flex;
    height: 500px;
    color: ${props => props.theme.BlackWhite};
    justify-content: center;
    align-items: center;

`;

const ItemDetails = styled.div`
    width: 100%;
    padding: 2rem 0 2rem 0;
    height: 150px;
    border-bottom: 1px solid ${props => props.theme.GrayGrayR};
    display: flex;
    justify-content: center;
    align-items: center;

    & span {
        cursor: pointer;
    }
`;

const Quantity = styled.input`
    font-family: inherit;
    font-size: 1rem;
    margin-top: 1rem;
    margin-left:0.3rem;
    padding:.5rem .8rem;
    outline:none;
    border:none;
`;
