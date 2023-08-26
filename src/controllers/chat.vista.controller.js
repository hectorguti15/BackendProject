export const getChat  = (req, res) =>{
    try{
        res.render("chat",{ nombre: req.user.firstName})
    }
    catch(e){
        req.logger.error(e)
    }
}