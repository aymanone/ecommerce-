import {useState,useEffect,useContext} from "react";
import { redirect } from "react-router-dom";
import sessionContext from "./contexts/sessionContext.jsx";
import SigninNav from "./SigninNav.jsx";
import NotSigninNav from "./NotSigningNav.jsx";

export default function Orders(props){
    const [session,setSession]=useContext(sessionContext);
    const [orderState,useOrderState]=useState({msg:"please wait loading",orders:undefined});
    const style={
        border:"1px solid red",
        margin:"2px"
        
    }
    const getOrders=async()=>{
       const{data,error} =await props.supabaseClient.from("orders").select().eq('user_id',session.user.id).order(
           'created_at',{ascending:false}
       );
       if(data){
           
           useOrderState({msg:"your orders",orders:data});
       }
       else{
           useOrderState({...orderState,msg:"an error occured please try again"});
       }

    }
    useEffect(()=>{
        getOrders();
    },[]);
    

    
    
    return (
        <>
         {session.user?
        <SigninNav supabaseClient={props.supabaseClient}></SigninNav>:
        <NotSigninNav></NotSigninNav>
        }
        <h2> {session.user?orderState.msg:"login or signup"}</h2>
        
        {session.user && orderState.orders?
        
        <ul>
        
        {orderState.orders.map((order)=>{
        return (
            <li key={order.id} style={style}> 
            <div>name:&nbsp;{order.item_name}</div>
            <div>price:&nbsp;{order.price}</div>
            <div>date:&nbsp;{new Date(order.created_at).toString()}</div>
            <div>state:&nbsp;{order.state}</div>
            </li>
        )
    }
        )
        
        }
        </ul>
        :""
        }
        </>
    )
}