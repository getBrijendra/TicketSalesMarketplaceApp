import express, {Response, Request} from 'express'
import {body, validationResult} from 'express-validator'
import jwt from 'jsonwebtoken'

import { validateRequest } from '../middlewares/validate-request'
import { User } from '../models/user'
import { RequestValidationError } from '../errors/request-validation-error'
//import { DatabaseConnectionError } from '../errors/database-connection-error'
import { BadRequestError } from '../errors/bad-request-error'

const router = express.Router()

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('password must be between 4 to 20 chars'),
    ], validateRequest, 
    async (req: Request, res: Response) => {
        // const errors = validationResult(req)
        // if (!errors.isEmpty()) {
        //     // const err = new Error('Invalid email or password')
        //     // throw new Error('Invalid email or password')
        //     //return res.status(400).send(errors.array())
        //     throw new RequestValidationError(errors.array())
        // }

        const { email, password } = req.body
        // console.log('Creating a user...')
        // throw new DatabaseConnectionError()
        // res.send('Hi there!')

        const existingUser = await User.findOne({ email }) 
        if (existingUser) {
            // console.log('email already in use')
            // return res.send({})
            throw new BadRequestError('email already in use')
        }
        const user = User.build({ email, password })
        await user.save()
        //Generate JWT
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!)
        //command to set secret in kubernetes.
        //kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf


        //store it on session object
        req.session = { jwt: userJwt}

        res.status(201).send(user)

})

export {router as signupRouter}

