export default class ExpressError extends Error{
    
    constructor(public status:number,public message:string){
        super();
    }
}