import express, { Response, Request} from 'express'
import { body, validationResult } from 'express-validator'
//import { RequestValidationError } from '../errors/request-validation-error'
import { User } from '../models/user'
import { validateRequest } from '../middlewares/validate-request' 
import { BadRequestError } from '../errors/bad-request-error'
import { Password } from '../services/password'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/api/users/signin', [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('You must supply a password')
    ], 
    validateRequest, 
    async (req: Request, res: Response) => {
    // const errors = validationResult(req)
    // if(!errors.isEmpty()) {
    //     throw new RequestValidationError(errors.array())
    // }
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(!user) {
        throw new BadRequestError('Invalid email')
    }
    const passwordsMatch = await Password.compare(user.password, password)
    if(!passwordsMatch) {
        throw new BadRequestError('Invalid password')
    }
   //Generate JWT
   const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!)
    //command to set secret in kubernetes.
    //kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf


    //store it on session object
    req.session = { jwt: userJwt}

    res.status(200).send(user)
})

export {router as signinRouter}