import {useState,useRef,useContext,useEffect} from "react";
import { redirect } from "react-router-dom";
import sessionContext from "./contexts/sessionContext.jsx";
import NotSigninNav from "./NotSigningNav.jsx";
import SigninNav from "./SigninNav.jsx";
import ShopItem from "./ShopItem.jsx";
export default function Shop(props){
    
    const [session,setSession]=useContext(sessionContext);
    const [shopState,useShopState]=useState({msg:"please wait for loading",
    products:undefined

  });
    let channel;
  
    const getProducts = async ()=>{
      const {data,error}=await props.supabaseClient.from("products").select(`id,name,amount,price`).neq("amount",0);
      if(data){
        const products=data.sort((a,b)=>a.id - b.id);
        const msg=products.length>0?"our products":"no products in the shop";
        useShopState((state)=>({msg:msg,products:products}));
      }
      else{
        useShopState({...shopState,msg:"sorry an error occured try later"});
      }
     }
     
    
    const handleRealTimeUpdate=(product)=>{
      
         const productIndex=shopState.products.findIndex(p=>p.id==product.id);
         if(productIndex != -1){
           shopState.products[productIndex]=product;
          
           useShopState({...shopState,products:[...shopState.products]});
         }


    }
    useEffect(()=>{
      if(session.user){
      getProducts();
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
          return console.log("shop leaving");
          

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
      
      

    })},[shopState.products]);
    
    
    return (
        <>
        {session.user?
        <SigninNav supabaseClient={props.supabaseClient}></SigninNav>:
        <NotSigninNav></NotSigninNav>
    
        }

        <h1>shop</h1>
        <h2> {session.user?shopState.msg:"login or signup"}</h2>
        { session.user && shopState.products?
        <ul>
        {shopState.products.map((item)=><ShopItem key={item.id} item={item} 
        supabaseClient={props.supabaseClient} />)}</ul>:""
        }
        </>
    )
}