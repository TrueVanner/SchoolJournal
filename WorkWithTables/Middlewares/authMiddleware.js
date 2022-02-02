module.exports = (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;
//         if(!authHeader) throw new Error("Auth header is empty!");

//         const accessToken = authHeader.split(" ")[1];
//         if (!accessToken) throw new Error("Auth token is empty!");

//         const userData = await fetch(new Request("localhost:3000/auth/validateToken", {method:"GET", body: {token: token}}));
//         if (!userData) throw new Error("Invalid token!");

//         req.user = userData;
//         next();
//     } catch (e) {return next(e);}
// }

next();}