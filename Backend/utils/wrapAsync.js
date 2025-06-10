module.exports = function (func) {
    return (req,res,next) => {
        func(req,res,next).catch(err => {
            console.log("Error");
            return next(err);
        });
    }
}