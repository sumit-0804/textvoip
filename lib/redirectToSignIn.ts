
import { auth } from "@clerk/nextjs/server";
export const redirectToSignIn : Function = async()=>{
    const {redirectToSignIn} = await auth() ;
    return redirectToSignIn;
}