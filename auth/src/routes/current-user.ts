import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { currentUser } from '../middlewares/current-user'
//import { requireAuth } from '../middlewares/require-auth'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, (req, res) => {
    // //if(!req.session || !req.session.jwt) {
    // if(!req.session?.jwt) { //above line is same as below
    //     return res.send({currentUser: null})
    // }
    // try {
    //     const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!)
    //     return res.send({currentUser: payload})
    // } catch(err) {
    //     return res.send({currentUser: null})
    // }
    res.send({ currentUser: req.currentUser || null })
})

export {router as currentUserRouter}