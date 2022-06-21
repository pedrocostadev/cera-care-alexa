import { ErrorTypes } from './constants';

/**
 * Creates an error with the given message and type.
 * 
 * @param error 
 * @param type 
 * @returns 
 */
 function createError(
   error: Error,
   type: ErrorTypes = ErrorTypes.Unknown
): Error {
    const e = new Error(error.message);
    e.name = type;
    e.stack = error.stack;

    return e;
}

export const errorHelper = {
    createError,
}