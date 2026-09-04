import express, {Router} from "express"

import { authcontroller } from "../controllers/authcontroller"

const router=Router()
const auth=new authcontroller()


router.post("/signin", auth.signin)
router.post("/login", auth.login)

export default router