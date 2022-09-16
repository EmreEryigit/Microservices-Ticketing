import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

/* export interface CustomError {
    statusCode: number;
    serializeErrors(): {
        message: string;
        field?: string;
    }[];
} */

export class RequestValidationError extends CustomError {
    statusCode = 400;
    constructor(public errors: ValidationError[]) {
        super("Invalid request parameters");

        // only because extending built in class
        Object.setPrototypeOf(this, CustomError.prototype);
    }
    serializeErrors = () => {
        return this.errors.map((err) => {
            return { message: err.msg, field: err.param };
        });
    };
}
