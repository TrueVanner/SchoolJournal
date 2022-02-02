const jwt = require("jsonwebtoken");

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_CODE,
            {expiresIn: "1y"});

        return accessToken;
    }

    validateToken(token) {
        try {
            const data = jwt.verify(token, process.env.ACCESS_TOKEN_CODE);
            return data;
        } catch (e) {
            return null;
        }
    }
}

module.exports = new TokenService();