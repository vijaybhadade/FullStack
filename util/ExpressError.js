class ExpressError extends Error {
    constructor(status, message) {   // ✅ correct spelling
        super(message);              // ✅ pass message to Error
        this.status = status;
    }
}

module.exports = ExpressError;
