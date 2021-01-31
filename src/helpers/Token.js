class Token {
    constructor() {
        if (!!Token.instance) {
            return Token.instance;
        }
        this._authToken = null;
        Token.instance = this;
        return this;
    }
    get _authToken() {
        return this._authToken;
    }

    set _authToken(tokenValue) {
        localStorage.setItem(this.tokenKey, tokenValue);
        this._authToken = tokenValue;
    }
}