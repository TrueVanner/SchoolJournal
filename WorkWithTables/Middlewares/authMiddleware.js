//const tableMiddleware = require("../Services/tableService")

/**
 * Was supposed to check the token and save user data. Development ended due to "tableMiddleware.httpRequest" not working.
 */

 module.exports = (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;
//         if(!authHeader) throw new Error("Auth header is empty!");

//         const accessToken = authHeader.split(" ")[1];
//         if (!accessToken) throw new Error("Auth token is empty!");

//         const userData = tableMiddleware.httpRequest("/auth/validateToken", JSON.stringify({
//             token: token
//         }))

//         if (!userData) throw new Error("Invalid token!");

//         req.user = userData;
//         next();
//     } catch (e) {return next(e);}
// }

next();}