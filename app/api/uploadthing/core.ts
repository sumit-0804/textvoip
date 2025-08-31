import {auth} from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

export const dynamic = 'force-dynamic';
 
const f = createUploadthing();
 
const handleAuth = () =>{
    try {
        const {userId} = auth();
        if(!userId) throw new Error("Unauthorized");
        return {userId : userId};
    } catch (error) {
        throw new Error("Unauthorized");
    }
}
 
export const ourFileRouter = {
    serverImage : f({image:{maxFileSize:"4MB", maxFileCount: 1}}).middleware(()=>handleAuth()).onUploadComplete(()=>{}),
    messageFile: f(['image','pdf']).middleware(()=>handleAuth()).onUploadComplete(()=>{})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;