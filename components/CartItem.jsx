import {useState,useContext} from "react";
import sessionContext from "./contexts/sessionContext.jsx";


export default function CartItem(props){
    const [session,setSession]=useContext(sessionContext);
    const[buystate,useBuyState]=useState({num:0,msg:"buy"});
    const handleBuy=async()=>{
        const {data,error}=await props.supabaseClient.rpc('decrease',{x:1,row_id:props.item.id});
        if(data && data==="succes"){
            const{data,error}=await props.supabaseClient.from('orders').insert({
                price:props.item.price,
                item_name:props.item.name,
                user_id:session.user.id,
                state:'registered'


            });
            if(!error){
                
                useBuyState({num:buystate.num+1,msg:"bought"});
            }
            else{
            
                const{data,error}=await props.supabaseClient.rpc('increaseitemamount',
                {x:1,row_id:props.item.id});
                useBuyState({...buystate,msg:"failed to buy"});
                
                
            
            }
           
        }
        else{
        useBuyState({...buystate,msg:"failed to buy"});
        }
    }
   
    return (
        <>
       <h1>name:&nbsp;{props.item.name}</h1>
        <p>describtion:&nbsp;{props.item.describtion}</p>
        <p>amount:&nbsp;{props.item.amount}</p>
        <p>price:&nbsp;{props.item.price}</p>
        <p>bought:&nbsp;{buystate.num}</p>
        
        <div>
            <button disabled={props.item.amount===0} onClick={handleBuy}>buy</button>
        </div>
       
        </>
    )
}