import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

function CategoryPage() {
    const [products, setProducts] = useState();
    const [productMsg, setProductMsg] = useState('');
    useEffect(() => {
        axios({
            method: "GET",
            url: "/api/products/",

        })
            .then(res => {
                setProducts(res.data)
            })
            .catch(err => {
                if (err.response.status === 400) return setProductMsg("مشکلی پیش آمده...");
                if (err.response.status === 404) return setProductMsg("محصولی وجود ندارد");
            })
    }, [products])

    const productsMap = (
        products?.map(item => {
            return (
                <Link to={"/category/id/" + item.pid}>
                    <Card>
                        <Img src={item.imageUrl} />
                        <CardDetail>
                            <p>{item.name}</p>
                        </CardDetail>
                    </Card>
                </Link>
            );
        })
    );
    return (
        <C>
            {productMsg === '' ? productsMap : <ProductMsg>{productMsg}</ProductMsg>}
        </C>
    )
}

export default CategoryPage;

const C = styled.div`
    margin-right:16%;
    padding:4rem 0 0 0;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    align-self:center;
    flex-wrap:wrap;
`;

const Card = styled.div`
    position:relative;
    margin: 0 0 3rem 3rem;
    box-shadow: 0 4px 8px ${props => props.theme.Status ? "rgba(0,0,0,0.2)" : "rgba(0, 0, 0, 0.8)"};
    transition: 0.3s;
    border-radius: 5px;
    width:180px;
    height:240px;
    display:flex;
    flex-direction:column;
    justify-content:space-around;
    align-items:center;
    background-color: ${props => props.theme.WhiteNearBlack};

    &:hover {
        box-shadow: 0 8px 16px ${props => props.theme.Status ? "rgba(0,0,0,0.2)" : "rgba(0, 0, 0, 0.8)"};
    }

`;

const Img = styled.img`
    border-radius: 5px 5px 0 0; 
    margin:1rem;
    width:50%;

`;

const Link = styled(NavLink)`
    text-decoration:none;
`;

const CardDetail = styled.div`
    padding: 2px 16px;
    text-align:center;
    font-family:'samim';
    font-weight:bold;
    color: ${props => props.theme.BlackWhite} ;
`;

const ProductMsg = styled.p`
    color: ${props => props.theme.BlackWhite};
    font-family: "samim";
    font-size: 1rem;
`;