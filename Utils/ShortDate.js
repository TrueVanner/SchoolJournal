module.exports = class ShortDate {
    day;
    month;

    constructor(string) {
        if (typeof(string) == "string") {
            this.day = string.split(".")[0];
            this.month = string.split(".")[1];
            this.checkDate();
        } else throw new Error("Not a string");
    }
    
    checkDate() {
        if (this.month <= 0 || this.month > 12) throw new Error("Bad month!")
        if (this.day > ([1, 3, 5, 7, 8, 10, 12].includes(this.month) ? 31 : (this.month == 2 ? 28 : 30))) throw new Error("Bad day! (Hopefully not for you!)");
    }

    toString() {
        return `${this.day}.${this.month}`
    }

    userFriendly() {
        if (this.day < 9 && !this.day.includes("0")) this.day = "0" + this.day;
        if (this.month < 9 && !this.month.includes("0")) this.month = "0" + this.month;

        return this;
    }

    noZeros() {
        this.day = this.day.replace("0", "");
        this.month = this.month.replace("0", "");

        return this;
    }

    relativeTo(shortDate) {
        return (this.month != shortDate.month ? Math.sign(this.month - shortDate.month) : Math.sign(this.day - shortDate.day))
    }

    static today() {
        return new ShortDate(`${new Date().getDate()}.${new Date().getMonth() + 1}`);
    }
}