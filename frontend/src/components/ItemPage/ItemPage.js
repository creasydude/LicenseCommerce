import { useEffect, useState, Fragment } from "react"
import axios from "axios"
import styled from "styled-components";
import { NavLink, useParams, useHistory } from "react-router-dom";
import Storage from "local-storage-fallback";

function ItemPage() {
    const [qty, setQty] = useState(1);
    let { pid } = useParams();
    const history = useHistory();
    const [product, setProduct] = useState();
    const [productMsg, setProductMsg] = useState('');
    const [sAddToCard, setSAddToCard] = useState('');

    useEffect(() => {
        axios({
            method: "GET",
            url: `/api/products/id/${pid}`,
        })
            .then(res => {
                setProduct(res.data);
            })
            .catch(err => {
                if (err.response.status === 404) {
                    setProductMsg("محصولی به این مشخصات پیدا نشد");
                } else {
                    setProductMsg(err.response.status + " " + err.response.data)
                }
            })
    })
    const addToCardHandler = (e) => {
        e.preventDefault()
        axios({
            method: "POST",
            url: "/api/checkout/addToCart",
            headers: { 'x-access-token': Storage.getItem("x-access-token") },
            data: {
                productId: pid,
                productQty: qty
            }
        })
            .then(res => {
                setSAddToCard("محصول با موفقیت به سبد خرید اضافه شد!")
                setTimeout(() => {
                    setSAddToCard('');
                }, 2000);
            })
            .catch(err => {
                console.log(err.response)
                if (err.response.status === 401) {
                    setSAddToCard("برای خرید باید وارد سایت شوید")
                    setTimeout(() => {
                        setSAddToCard('');
                    }, 2000);
                } else {
                    setSAddToCard("Bad Request!")
                    setTimeout(() => {
                        setSAddToCard('');
                    }, 2000);
                }
            })
        history.go(0)
    }
    const showProduct = (
        <Fragment>
            <BackArrow to="/category">➜ بازگشت به دسته بندی</BackArrow>
            <ItemContainer>
                <ImageContainer>
                    <img src={product?.imageUrl} />
                </ImageContainer>
                <OtherInfoContainer>
                    <OIDIV>
                        <h4>{product?.name}</h4>
                        <p>{product?.description}</p>
                        <Quantity onChange={(e) => { setQty(e.target.value); }} autoComplete="off" type="number" min="1" max="100" defaultValue="1" />
                        <OrderBtn onClick={(e) => { addToCardHandler(e) }}>افزودن به سبد خرید</OrderBtn>
                        <p>{sAddToCard}</p>
                    </OIDIV>
                </OtherInfoContainer>
            </ItemContainer>
        </Fragment>
    );

    return (
        <C>
            {productMsg === '' ? showProduct : <ProductMsg>{productMsg}</ProductMsg>}
        </C>
    )
}

export default ItemPage;

const C = styled.div`
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

const BackArrow = styled(NavLink)`
    text-decoration: none;
    color: ${props => props.theme.BlackWhite};
    font-size: 1rem;
    font-family: "samim";
    padding: 0 1rem;
    @media only screen and (max-width: 769px) {
        padding-bottom: 1rem;
    }
`;

const ItemContainer = styled.div`
    width: 80%;
    min-height: 500px;
    background-color: ${props => props.theme.ShopCardPadding};
    display: flex;
    flex-direction: row;

    @media only screen and (max-width: 769px) {
        width: 90%;
        min-height: 600px;
        margin-bottom: 2rem;
        flex-direction:column;
        justify-content: center;
        align-items: center;
    }
    
`;

const ImageContainer = styled.div`
    width: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    & img {
        width: 40%;

    }

    @media only screen and (max-width: 769px) {
        padding: 1rem;
    }
`;

const OtherInfoContainer = styled.div`
    width:70%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const OrderBtn = styled.button`
    font-family:inherit;
    font-size:1rem;
    margin-top:1rem;
    margin-bottom: 2rem;
    margin-left:0.3rem;
    padding:.5rem .8rem;
    outline:none;
    border:none;
    background-color:${props => props.theme.OrangePurple};
    border-radius:0.3rem;
    cursor:pointer;
    color:${props => props.theme.BlackWhite};
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

const OIDIV = styled.div`
    width: 80%;
    color: ${props => props.theme.BlackWhite};
    & h4,p {
        padding-bottom: 2rem;
    }
`;

const ProductMsg = styled.p`
    margin-right: 0%;
    font-family: "samim";
    font-size: 1rem;
    color: ${props => props.theme.BlackWhite};
`;