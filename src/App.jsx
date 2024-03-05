import { useState,useMemo,useEffect} from 'react'
import sessionContext from "/components/contexts/sessionContext.jsx";
import logo from './logo.svg'
import SignIn from "/components/SignIn.jsx";
import SignUp from "/components/SignUp.jsx";
import Shop from "/components/Shop.jsx";
import Cart from "/components/Cart.jsx";
import Orders from "/components/Orders.jsx";
import supabaseClient from "./supabaseClient.jsx";
import { BrowserRouter, Routes, Route, createBrowserRouter,
  RouterProvider } from "react-router-dom";
import './App.css'


 function   App() {
 
  const router=createBrowserRouter([
    {
      path:"/",
      element:<Shop supabaseClient={supabaseClient}/>
    },
    {
      path:"/signin",
      element:<SignIn  supabaseClient={supabaseClient} />
      
    },
  {
    path:"/Signup",
    element:<SignUp supabaseClient={supabaseClient}   />
  },
  {
    path:"/cart",
    element:<Cart  supabaseClient={supabaseClient}/>
  },
  {
    path:"/myorders",
    element:<Orders supabaseClient={supabaseClient} />
  }
]
  );
  
  const [session,setSession]=useState(()=>{
            const session=localStorage.getItem("session");
            if(session){return JSON.parse(session);}
            return {user:undefined,items:{}};
  });
  useEffect(()=>{
    
    setSession(JSON.parse(localStorage.getItem("session")));
  },[])
  useEffect(()=>{
    
    localStorage.setItem("session",JSON.stringify(session));
   
  })
  useEffect(()=>{
    window.addEventListener("beforeunload",(ev)=>{
      //
      ev.preventDefault();
      supabaseClient.removeAllChannels();
     return console.log("app before unload");
    })
  });
  
  return (
    <sessionContext.Provider value={[session,setSession]}>
    <RouterProvider router={router}>
    </RouterProvider>
    </sessionContext.Provider>
    
  )
}

export default App
