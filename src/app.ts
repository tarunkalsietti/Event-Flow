import express from "express";
import cors from "cors";
import authroute from "./routes/authroute"
const app=express();
app.use(cors());
app.use(express.json());


app.get("/health", (req,res)=>{
res.json({
    status:"ok"
})


app.use(authroute);

})
export default app;
