const tokenService = require("./tokenService");

class AuthService {
    /**
     * The user was supposed to specify the journal to change, and then be able to perform all functions without
     * entering the journal name, using the token. Didn't finish the thing due to the lack of time.
     * @param {String} journalName 
     * @returns 
     */
    async login(journalName) {
        const token = tokenService.generateToken({
            journal_name: journalName
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