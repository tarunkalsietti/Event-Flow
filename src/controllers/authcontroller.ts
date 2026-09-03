import { Request, Response } from "express";
import { Authenticationservice, sign  , login } from "../services/authservice";

const auth= new Authenticationservice();

export class authcontroller{
    signin=async(req:Request,res:Response):Promise<void>=>{
        try{
       const {name , email , password} = req.body
       if(!name || !email || !password){
        res.status(400).json({
            message:"credential are missing",
            data:null
        })
        return;
       }
     const result=await auth.signin(req.body)
     if(result){
        res.status(201).json({
            message:"user created sucessfully",
            data:result
        });

     }}


        catch(error:any){
            if(error.message==="EMAIL_EXISTS"){
                res.status(400).json({
                    message:"email already exist",
                    data:null
                })
                return
            };
 console.error("Signup error:", error);
    res.status(500).json({
      message: "Internal server error",
      data: null,
        });
        
    }
}
}
