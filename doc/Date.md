Example of a Javascript class with private fields:

```javascript
class Date {

    /* declare static array and constants */
    static MONTH_DAYS = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    static MIN_YEAR = 1850;
    static MAX_YEAR = 2100;

    /* declare three private fields */
    #day;
    #month;
    #year;

    constructor(day, month, year)
    {
        if (!Date.isValid(day, month, year))
            throw new Error(`invalid date parameters: ${day},${month},${year}`);

        this.#day = day;
        this.#month = month;
        this.#year = year;
    }

    static isValid(day, month, year)
    {
        return Date.MIN_YEAR <=  year && year  <= Date.MAX_YEAR &&
                           1 <= month && month <= 12            &&
                           1 <=   day && (day <= Date.MONTH_DAYS[month-1] ||
                                          (day === 29 && Date.isLeapYear(year)));
    }

    static isLeapYear(year)
    {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }

    get day()
    {
        return this.#day;
    }

    get month()
    {
        return this.#month;
    }

    get year()
    {
        return this.#year;
    }

    toString()
    {
        return `${this.#day}/${this.#month}/${this.#year}`;
    }
}

const date = new Date(29, 2, 2004);
console.log(date.day); // logs 29

try {
    new Date(29, 2, 2002);
} catch (e) {
    console.log('OK: 2001 was not a leap year');
}
```
