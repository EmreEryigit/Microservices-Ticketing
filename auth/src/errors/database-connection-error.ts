import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    reason = "Error connecting to database";
    constructor() {
        super("Error connecting to db");

        // only because extending built in class
        Object.setPrototypeOf(this, CustomError.prototype);
    }
    serializeErrors = () => {
        return [{ message: this.reason }];
    };
}
