import { Request, Response, NextFunction } from "express"
import { RequestValidationError } from '../errors/request-validation-error'
import { DatabaseConnectionError } from '../errors/database-connection-error'
import { CustomError } from "../errors/custom-errors"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    //console.log('something went wrong', err)
    //if (err instanceof RequestValidationError) {
    if (err instanceof CustomError) {
        //console.log('handling this error as request validation error')
        // const formattedErr = err.errors.map(error => {
        //     return {message: error.msg, field: error.param}
        // })
        //return res.status(400).send({errors: formattedErr})
        return res.status(err.statusCode).send({errors: err.serializeErrors()})
    }
    // if (err instanceof DatabaseConnectionError) {
    //     //console.log('handling this error as database connection error')
    //     return res.status(err.statusCode).send({errors: err.serializeErrors()})
    // }
    res.status(400).send({ errors: [{
            message: err.message
        }]
    })
}