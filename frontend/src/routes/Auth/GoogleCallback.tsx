import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts";
import { useCallback, useEffect } from "react";
import { get } from "../../server";


export default function GoogleCallback(){
    const navigate = useNavigate();
    const {loginGoogle} = useAuth();

    const loginAccount = useCallback( async() => {
        try{
            await loginGoogle(() => navigate('/'));
        }catch (err: any) {
            alert(err?.response?.data?.message || 'Login failed');
        }
        // await get('/auth/test-guard2')
        // .then(res => res.json())
        // .then(data => console.log(data));
    },[loginGoogle, navigate])

    useEffect( () => {
        loginAccount();
    },[loginAccount])

    return <div>처리중</div>
}