import { generateProduct } from "../utils/faker.js";


export const productsFaker = (req,res) =>{
    let products = [];
    for(let i = 0; i<100; i++){
        products.push(generateProduct());
        
    }
    res.send({status: "success", payload: products})
}