import { CustomError } from "./custom-errors"

export class DatabaseConnectionError extends CustomError {
    statusCode = 500
    reason = 'Error connecting to database'
    constructor() {
        super('Error conecitng to DB...')
        //only because we are extending a built in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeErrors() {
        return [
            { message: this. reason}
        ]
    }
}