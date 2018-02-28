'use strict';
var namespace = namespace || {};

namespace.TimeCalculator = function () {
    //constructor

    this.localeDict = {
        '1033' : 'en-us', 
        '1053' : 'sv-se'
    };
};

namespace.TimeCalculator.prototype = function () {
    
    var getDayNameByLocaleString = function (date, localeString) {
        //returns a string with day name corresponding to input date
        return date.toLocaleDateString(localeString, { weekday: 'long' });
    }

    var getDayNameByLocaleCountryIdDecimal = function (date, localeCountryIdDecimal) {
        //returns a string with day name corresponding to input date
        var self = this;

        var localeString = self.localeDict[localeCountryIdDecimal];
        return self.getDayNameByLocaleString(date, localeString);
    }

    var dateAfterDays = function (originalDate, nbrDaysToAdd) {
        //returns a (new) date object corresponding to the number of days added

        var newDate = new Date(originalDate.getTime());
        newDate.setDate(newDate.getDate() + nbrDaysToAdd);
        return newDate;
    }

    return {
        getDayNameByLocaleString: getDayNameByLocaleString,
        getDayNameByLocaleCountryIdDecimal: getDayNameByLocaleCountryIdDecimal,
        dateAfterDays: dateAfterDays
    };
}();