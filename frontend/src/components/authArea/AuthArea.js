import { useState } from 'react';
import styled from 'styled-components';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';
import Storage from 'local-storage-fallback';
import validator from 'validator'

function AuthArea(props) {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [emailError, setEmailError] = useState('')
    const [showOtp, setShowOtp] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const validateEmail = (e) => {
        var email = e.target.value
        if (validator.isEmail(email)) {
            setEmailError('')
            setEmail(email)
        } else {
            setEmailError('ایمیل معتبر وارد کنید')
        }
    }
    const authHandlerOne = (e) => {
        e.preventDefault()
        if (validator.isEmail(email)) {
            axios({
                method: 'POST',
                url: "/api/users/auth",
                data: {
                    email: email,
                }
            })
                .then(res => {
                    setError("رمز یکبار مصرف به ایمیل شما ارسال شد");
                    setShowOtp(true);
                })
                .catch(err => {
                    if (err.response.status == 400) {
                        setError("رمز یکبار مصرف وجود دارد یک دقیقه صبر کنید");
                    } else {
                        setError(err.response.status + " " + err.response.data)
                    }
                })
        }
    }

    const authHandlerOtp = (e) => {
        e.preventDefault()
        axios({
            method: "POST",
            url: "/api/users/authVerify",
            data: {
                email: email,
                otp: otp
            }
        })
            .then(res => {
                setError("با موفقیت وارد شدید...");
                Storage.setItem("x-access-token", res.data.accessToken)
                history.push('/profile')
            })
            .catch(err => {
                if (err.response.status == 400 || 401) {
                    setError("رمز یکبار مصرف اشتباه است");
                } else {
                    setError(err.response.status + " " + err.response.data)
                }
            })
    }
    return (
        <C>
            <LoginBox>
                <SideBox>
                    <h4>LOGO</h4>
                </SideBox>
                <ASideBox>
                    <h4>ورود / ثبت نام</h4>
                    <AArea>
                        <FormGroup>
                            <p>{error}</p>
                            {showOtp ? (
                                <FormDiv>
                                    <span></span>
                                    <FormField onChange={(e) => setOtp(e.target.value)} autocomplete="off" type="text" placeholder="رمز یکبار مصرف" required />
                                    <FormLable className="form-label">رمز یکبار مصرف</FormLable>
                                    <SubmitLR onClick={authHandlerOtp} type="submit" value="ورود" />
                                </FormDiv>
                            ) : (
                                <FormDiv>
                                    <FormField onChange={(e) => validateEmail(e)} autocomplete="off" type="input" placeholder="ایمیل" required />
                                    <FormLable className="form-label">ایمیل</FormLable>
                                    <p>{emailError}</p>
                                    <SubmitLR onClick={authHandlerOne} type="submit" value="ورود/ثبت نام" />
                                </FormDiv>
                            )}
                        </FormGroup>

                    </AArea>
                </ASideBox>
            </LoginBox>
        </C>
    )
}


export default AuthArea;

const C = styled.div`
    width:100%;
    min-height:500px;
    margin-right:15%;
    padding:2rem;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    align-self:center;
    font-family: 'samim';

    @media only screen and (max-width: 769px) {
        margin-right:0;
        
    }

    & h4 {
        padding:1rem 1rem;
        color: ${props => props.theme.BlackWhite};
        
    }
    

`;

const LoginBox = styled.div`
    position:relative;
    width:900px;
    height:500px;
    background-color: ${props => props.theme.ShopCardPadding};
    display:flex;
    flex-direction:row;
    overflow:hidden;

    @media only screen and (max-width: 769px) {
        width:100%;
    }
    
`;

const SideBox = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-content:center;
    align-items:center;
    width:300px;
    height:100%;
    background-color: ${props => props.theme.OrangePurple} ;

    & h4 {
        font-size:2rem;
    }

    & h4:hover {
        text-decoration:underline;
    }

    @media only screen and (max-width: 769px) {
        display:none;
    }
`;

const AArea = styled.form`
    width:450px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
`;

const FormGroup = styled.form`
    position: relative;
	padding: 15px 0 0;
	margin-top: 10px;
	width: 50%;
`;

const FormField = styled.input`
    margin-bottom:1rem;
    font-family: inherit;
	 width: 100%;
	 border: 0;
	 border-bottom: 2px solid #9b9b9b;
	 outline: 0;
	 font-size: 1.3rem;
	 color: ${props => props.theme.BlackWhite};
	 padding: 7px 0;
	 background: transparent;
	 transition: border-color 0.2s;

     &::placeholder {
        color: transparent;
     }

     &:placeholder-shown ~ .form-label {
        font-size: 1.3rem;
	    cursor: text;
	    top: 20px;
     }

     &:focus {
        padding-bottom: 6px;
	    font-weight: 700;
	    border-width: 3px;
	    border-image: linear-gradient(90deg, rgba(187,134,252,1) 0%, rgba(255,149,117,1) 100%);;
	    border-image-slice: 1;
     }

     &:required {
         box-shadow:none;
     }
     &:invalid {
         box-shadow:none;
     }

     &:focus ~ .form-label  {
        position: absolute;
	    top: 0;
	    display: block;
	    transition: 0.2s;
	    font-size: 1rem;
	    color: ${props => props.theme.OrangePurple};
	    font-weight: 700;
    }
`;

const FormLable = styled.label`
    position: absolute;
	top: 0;
	display: block;
	transition: 0.2s;
	font-size: 1rem;
	color: #9b9b9b;
`;

const SubmitLR = styled.input`
    font-family:inherit;
    font-size:1rem;
    margin-top:1rem;
    margin-left:0.3rem;
    padding:.5rem .8rem;
    outline:none;
    border:none;
    background-color:${props => props.theme.OrangePurple};
    border-radius:0.3rem;
    cursor:pointer;
    color:${props => props.theme.BlackWhite};
`;

const ASideBox = styled.div`
    width:600px;
    height:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;

    @media only screen and (max-width: 769px) {
        width:100%;
    }
`;

const Link = styled(NavLink)`
    font-family:inherit;
    font-size:1rem;
    margin-top:1rem;
    margin-left:0.3rem;
    padding:.5rem .8rem;
    outline:none;
    border:none;
    background-color:${props => props.theme.OrangePurple};
    border-radius:0.3rem;
    cursor:pointer;
    color:${props => props.theme.BlackWhite};
    text-decoration:none;
`;

const ShowHideBlock = styled.span`
    display:block;
    color : ${props => props.theme.BlackWhite} ;
    position:relative;
    cursor:pointer;
    font-weight:bold;

`;

const FormDiv = styled.div`
    position: relative;
	padding: 15px 0 0;
	margin-top: 10px;
	width: 100%;
`;