import {useState,useContext} from "react";
import sessionContext from "./contexts/sessionContext.jsx";
export default function ShopItem(props){
    const [session,setSession]=useContext(sessionContext);
    const [addState,useAddState]=useState("add to cart");
    
    
    const handleAdd=()=>{
        if(session.items[props.item.id]){
            return ;
        }
        session.items[props.item.id]=props.item.id;
        setSession({...session,items:{...session.items}});
      

    }


    return(
        <>
        <h1>name:&nbsp;{props.item.name}</h1>
        <p>describtion:&nbsp;{props.item.describtion}</p>
        <p>amount:&nbsp;{props.item.amount}</p>
        <p>price:&nbsp;{props.item.price}</p>
        <p>{session.items[props.item.id]?"already in the cart":"not in the cart"}</p>
        <div>
            <button disabled={props.item.amount===0} onClick={handleAdd}>{addState}</button>
        </div>
        </>
    )
}