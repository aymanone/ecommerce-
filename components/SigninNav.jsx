import {useContext} from "react";
import { Link,useNavigate } from "react-router-dom";
import sessionContext from "./contexts/sessionContext.jsx";
import supabaseClient from "../src/supabaseClient.jsx";
export default function SigningNav (props){
  const [session,setSession]=useContext(sessionContext);
  const handleSignout=async ()=>{
    localStorage.setItem("session",JSON.stringify({user:undefined,items:[]}));
    props.supabaseClient.removeAllChannels();
    await props.supabaseClient.auth.signOut()
    setSession({user:undefined,items:{}});


  }
  return (
  <nav>
      <Link to="/">Home</Link> &nbsp;
      <Link to="/cart">shop cart</Link> &nbsp;
      <Link to="/myorders">my orders</Link>&nbsp;
      <button onClick={handleSignout}>sign out</button>
  </nav>
  )
}