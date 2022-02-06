// This class is used to simplify working with date system, used in school journals (01.12, 14.03 and so on). Does not work with dates from different years.


module.exports = class ShortDate {
    day;
    month;

    constructor(string) {
        if (typeof(string) === "string") {
            this.day = string.split(".")[0]
            this.month = string.split(".")[1]
            this.checkDate();
        } else throw new Error("Not a string");
    }

    /**
     * Checks if the date is valid, and transforms it if needed.
     */
    checkDate() {
        if (!this.day || !this.month) throw new Error("Null date");
        if (this.day <= 0 || this.month <= 0) throw new Error("Day and month can't be 0!");

        this.transformDate();
    }
    
    /**
     * Changes the date to be correct acccording to date standarts.
     */
    transformDate() {
        if (this.day > ([1, 3, 5, 7, 8, 10, 12].includes(this.month) ? 31 : (this.month == 2 ? 28 : 30))) {
            this.day = 1;
            this.month++;
        }
        
        if (this.month > 12) {
            this.month = 1;
            this.day = 1;
        }

        return this;
    }
    /**
     * @returns String format of the date.
     */
    toString() {
        return `${this.day}.${this.month}`
    }

    /**
     * Turns "X.Y" => "0X.0Y"
     * @returns updated ShortDate's string
     */
    userFriendly() {
        if (this.day < 10 && !this.day.startsWith("0")) this.day = "0" + this.day;
        if (this.month < 10 && !this.month.startsWith("0")) this.month = "0" + this.month;

        return this.toString();
    }

    /**
     * Turns "0X.0Y" => "X.Y"
     * @returns updated ShortDate
     */
    noZeros() {
        if (this.day.startsWith("0")) this.day = this.day[1]
        if (this.month.startsWith("0")) this.month = this.month[1]

        return this;
    }

    /**
     * @param {ShortDate} shortDate - ShortDate to compare with
     * @returns -1 if date shortDate is earlier, 0 if the dates are equal, and 1 if shortDate is later than this ShortDate.
     */
    relativeTo(shortDate) {
        this.noZeros();
        shortDate.noZeros();
        return (this.month != shortDate.month ? Math.sign(this.month - shortDate.month) : Math.sign(this.day - shortDate.day))
    }

    /**
     * Adds N days to the ShortDate
     * @param {number} n - days to add
     * @returns updated ShortDate
     */
    addDay(n) {
        this.noZeros();
        this.day = parseInt(this.day) + n
        this.checkDate();

        return this;
    }

    /**
     * @returns ShortDate of current date.
     */
    static today() {
        return new ShortDate(`${new Date().getDate()}.${new Date().getMonth() + 1}`);
    }
}