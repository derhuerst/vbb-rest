import { Response } from "express";


export function sendError400(response: Response, errorMessage: string) {
	console.log( `error ${errorMessage}`);
    
	response.status(400).send(errorMessage);
}