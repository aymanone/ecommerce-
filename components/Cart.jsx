import {useState,useRef,useContext,useEffect} from "react";
import { redirect } from "react-router-dom";
import sessionContext from "./contexts/sessionContext.jsx";
import CartItem from "./CartItem.jsx";
import SigninNav from "./SigninNav.jsx";
import NotSigninNav from "./NotSigningNav.jsx";
export default function Cart(props){
    const [session,setSession]=useContext(sessionContext);
    const [cartState,useCartState]=useState({msg:"please wait for loading",items:undefined});
    let channel;
    const getCartItems=async()=>{
        const{data,error}=await props.supabaseClient.from("products").
        select('id,name,amount,price').in('id',Object.keys(session.items));
        if(data){
           const items= data.sort((a,b)=>a.id-b.id);
           const msg=data.length>0?"your cart":"no items in the cart";
            useCartState({msg:msg,items:data});
        }
        else{
            useCartState({...cartState,msg:"an error accured please try again"});
        }
    }
    const handleRealTimeUpdate=async(item)=>{
        if(cartState.items ){
            const itemIndex=cartState.items.findIndex(p=>p.id==item.id);
            if(itemIndex!= -1){
                cartState.items[itemIndex]=item;
                useCartState({...cartState,items:[...cartState.items]});
            }
        }

    }
    useEffect(()=>{
        if(session.user){
        getCartItems();
        }
      },[])

     useEffect(()=>{
        
         
        if ( session.user ){
          
        
          
      channel=  props.supabaseClient.channel('observe-products')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'products',
          },
          (payload) => {
            // get new then update from it amount for id
            
            handleRealTimeUpdate(payload.new);
          }
        )
        .subscribe()
        }
        window.addEventListener("beforeunload",(ev)=>{
         ev.preventDefault();
          props.supabaseClient.removeChannel(channel);
          return console.log("cart leaving");
          

        });
        document.addEventListener("readystatechange",()=>{
          if(document.readyState=="complete" && session.user ){
            console.log("document ready");
          channel=  props.supabaseClient.channel('observe-products')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'products',
          },
         (payload) => {
            // get new then update from it amount for id
            
            handleRealTimeUpdate(payload.new);
          }
        )
        .subscribe();
          }
      
      

    })},[cartState.items]);
    
    return (
        <>
         {session.user?
        <SigninNav supabaseClient={props.supabaseClient}></SigninNav>:
        <NotSigninNav></NotSigninNav>
        }
        <h1>cart</h1>
        <h2> {session.user?cartState.msg:"login or signup"}</h2>
        { session.user && cartState.items?
        <ul>
        {cartState.items.map((item)=><CartItem key={item.id} item={item} 
        supabaseClient={props.supabaseClient} />)}</ul>:""
        }
        </>
    )
}