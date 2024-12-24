import express from 'express'
import { registerUser } from '../controller/userController.controller'

const router=express.Router()

router.route('/register').post(
    upload.fields([         //middleware for image uploads 
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route('/login').post(
    loginUser
)

export default router