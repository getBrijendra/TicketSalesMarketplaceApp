import { ValidationError } from "express-validator"
import { CustomError } from "./custom-errors"

// interface CustomErrorInterface {
//     statusCode: number
//     serializeErrors(): {
//         message: string
//         field?: string
//     }[]
// }


//export class RequestValidationError extends Error implements CustomErrorInterface{
export class RequestValidationError extends CustomError {
    statusCode = 400
    //public in ctor args create a property in class with same name and assign variable in ctor body
    constructor(public errors: ValidationError[]) {
        super('Invalid request params')
        //only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors() {
        return this.errors.map(error => {
            return { message: error.msg, field: error.param }
        })
    }
}

//throw new RequestValidationError(errors)