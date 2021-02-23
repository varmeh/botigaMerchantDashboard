export class Token {
    constructor() {
        if (!!Token.instance) {
            return Token.instance;
        }
        this.tokenKey = 'botiga-merchant-token'
        this._authToken = null;
        Token.instance = this;
        return this;
    }

    initAuthenticationToken() {
        const tokenValue = localStorage.getItem(this.tokenKey);
        this._authToken = tokenValue;
    }

    getAuthenticationToken() {
        return this._authToken;
    }

    async setAuthenticationToken(tokenValue) {
        localStorage.setItem(this.tokenKey, tokenValue);
        this._authToken = tokenValue;
    }
}