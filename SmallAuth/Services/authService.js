const tokenService = require("./tokenService");

class AuthService {
    async login(data) {
        console.log(data);
        const token = tokenService.generateToken({
            user_type: userType,
            journal_name: journal
        });
        
        return {
            token: token,
        }
    }

    async validateT(token) {
        const data = tokenService.validateToken(token);
        return {
            res: data
        }
    }
}

module.exports = new AuthService();