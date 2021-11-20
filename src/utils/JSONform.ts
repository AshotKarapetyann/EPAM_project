class JSONform {
    data!: object;
    info!: object;
    errorStatus!: Boolean;
    dateStatus!: Boolean;
    error!: object;
    constructor(data: object, errorStatus: Boolean, dateStatus: Boolean, error: object) {
        this.data = data;
        this.info = {
            "error": errorStatus,
            "data": dateStatus,
        };
        this.error = error;
    };
    static update_data() {
        return new JSONform({ Message: "Successfully updated... ✔️" }, false, true, {});
    };

    static delete_valid_data() {
        return new JSONform({ Message: "Successfully deleted... ✔️" }, false, true, {});
    };

    static bad_request() {
        return new JSONform({}, true, false, { Message: "Bad request... ❗", code: 400, Help: "Check your sending data...✍️" })
    };

    static not_found() {
        return new JSONform({}, true, false, { Message: "Not Found... ❎", code: 404, Help: "Try to write right information...✍️" })
    };

    static valid_one_data(data: object) {
        return new JSONform(data, false, true, {});
    };

    static valid_much_data(data: Array<object>) {
        return new JSONform(data, false, true, {});
    };

    static empty_data(data: object) {
        return new JSONform(data, false, false, {});
    };

    static invalid_user() {
        return new JSONform({}, true, false, { Message: "Invaid User... ❗", code: 409, Help: "Write right user name or id...✍️" });
    };

    static position_error(){
        return new JSONform({}, true, false, {Message: "Previous position and next position can't be equal... ❗", code: 400, Help: "Write right positions for tickets...✍️"});
    };

    static wrong_characters_number() {
        return new JSONform({}, true, false, { Message: "A lot of characters... ❗", code: 409, Help: "Write the name using fewer characters...✍️"});
    };

    static empty_string() {
        return new JSONform({}, true, false, { Message: "You are trying to send an empty string... ❗", code: 409, Help: "Send the filled string...✍️"})
    };

    static image_not_found(){
        return new JSONform({}, true, false, {Message:"Image not found... ❗", code:404, Help:"Check your image path...✍️"});
    };
};

export default JSONform;
