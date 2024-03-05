import {createContext} from "react";
const sessionContext=createContext({user:undefined,
    cart:[]
});
export default sessionContext;