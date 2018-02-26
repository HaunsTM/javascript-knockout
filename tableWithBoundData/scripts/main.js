'use strict';

/**
 * Dirty:
 * http://jsfiddle.net/rniemeyer/dtpfv/
 * 
 * Multiple categories:
 * http://jsfiddle.net/bZhCk/280/
 */
 
ko.dirtyFlag = function(root, isInitiallyDirty) {
    var result = function() {},
        _initialState = ko.observable(ko.toJSON(root)),
        _isInitiallyDirty = ko.observable(isInitiallyDirty);

    result.isDirty = ko.computed(function() {
        return _isInitiallyDirty() || _initialState() !== ko.toJSON(root);
    });

    result.reset = function() {
        _initialState(ko.toJSON(root));
        _isInitiallyDirty(false);
    };

    return result;
};

var ActicityCategory = function (categoryName, activities) {
    this.categoryName = ko.observable(categoryName);
    this.activities = ko.observableArray(activities);
}

var Activity = function (entityId, activityName, regarding, note, date, time, dependency, daysToAdd, timeTemplate, calculatedDayInFuture) {
    this.entityId = ko.observable(entityId);

    this.activityName = ko.observable(activityName);
    this.regarding = ko.observable(regarding);
    this.note = ko.observable(note);

    this.date = ko.observable(date);
    this.time = ko.observable(time);
    this.day = ko.pureComputed({
        read: function () {
            var svLCIDDec = "1053";
            var timeCalculator = new namespace.TimeCalculator();
            var dateObject = new Date(this.date());

            return timeCalculator.getDayNameByLocaleCountryIdDecimal(dateObject, svLCIDDec);
        },
        owner: this
    });

    this.dependency = ko.observable(dependency);
    this.daysToAdd = ko.observable(daysToAdd);
    this.timeTemplate = ko.observable(timeTemplate);

    this.calculatedDayInFuture = ko.observable(calculatedDayInFuture);

    this.btnCalculateGrid = ko.observable();

    this.dirtyFlag = new ko.dirtyFlag(this);
}

var viewModel = function(items) {


    /*
    this.items = ko.observableArray([
        new Activity(1, "Header Venture booked", "", "Satsningen ska vara anmäld", "2017-12-04", "00:00", "Releaseday", "45"),
        new Activity(2, "Circulation Deadline Preliminary", "", "Ev preliminär upplaga", "", "", "dependency", "")
    ]);

*/
(entityId, activityName, regarding, note, date, time, dependency, daysToAdd, timeTemplate, calculatedDayInFuture)
    this.categories = ko.observableArray([
        new ActivityCategory("Order Dates", [
                new Activity(1, "Header Venture booked", "", "Satsningen ska vara anmäld", "2017-12-04", "00:00", "Releaseday", "45", "00:00:00", "2017-12-04"),
                new Activity(2, "Circulation Deadline Preliminary", "", "Ev preliminär upplaga", "", "", "Circulation Deadline Defined", "", "00:00:00", ""),
                new Activity(3, "Circulation Deadline Definite", "", "Definitiv upplaga klar", "2018-01-19", "00:00", "Bindery Finished Sheet", "5", "08:30:00", "2018-01-19"),                
                new Activity(4, "Print Order Deadline Preliminary", "", "Ev. preliminär tryckorder", "", "", "Print Order Deadline Defined", "", "00:00:00", ""),
                new Activity(5, "Print Order Definte", "", "Definitiv tryckorder", "2018-01-22", "09:00", "Bindery Finished Sheet", "4", "09:00:00", "2018-01-22"),
            ]
        ),
        new ActivityCategory("Repro", [
                new Activity(6, "Sheet Repro", "Ark 1", "TV-sidor till ES senast 12.00", "2018-01-23", "00:00", "Printing", "", "00:00:00", "2018-01-23"),
                new Activity(7, "Sheet Repro", "Ark 2", "Lämning nästa vecka + tablå", "2018-01-23", "00:00", "Printing", "", "00:00:00", "2018-01-23"),
                new Activity(8, "Sheet Repro", "Ark 3 Kryss", "Slutlämning exkl sena sidor", "2018-01-23", "00:00", "Printing", "", "00:00:00", "2018-01-23"),
            ]
        ),
        new ActivityCategory("Sheet Printing", [
                new Activity(9, "Printing", "Ark 1", "Ark ska lämnas till tryck", "2018-01-23", "15:00", "Bindery Finished Sheet", "3", "15:00:00", "2018-01-23"),
                new Activity(10, "Printing", "Ark 2", "Ark ska lämnas till tryck", "2018-01-23", "15:00", "Bindery Finished Sheet", "3", "15:00:00", "2018-01-23"),
                new Activity(11, "Printing", "Ark 3 Kryss", "Ark ska lämnas till tryck", "2018-01-23", "15:00", "Bindery Finished Sheet", "3", "15:00:00", "2018-01-23"),

            ]
        ),
        new ActivityCategory("Binding", [
                new Activity(12, "Bindery Fished Sheet", "", "Ark till häftning", "2018-01-26", "00:00", "Edition Bindery", "0", "00:00:00", "2018-01-26"),
                new Activity(13, "Edition Bindery", "", "Normal bindningsstart", "2018-01-26", "00:00", "Releaseday", "9", "00:00:00", "2018-01-26")
            ]
        )
    ]);

        
    this.dirtyItems = ko.computed(function() {
        return ko.utils.arrayFilter(this.items(), function(item) {
            return item.dirtyFlag.isDirty();
        });
    }, this);
    
    this.isDirty = ko.computed(function() {
        return this.dirtyItems().length > 0;
    }, this);

    this.clickedOnSave = function (model, event) {
        var dataToSave = ko.toJSON(this.dirtyItems);
        console.log('Saving data: '+ dataToSave );
    }

    this.clickedOnSaveAndExit = function (model, event) {        
        console.log('Closing');
    };
};

ko.applyBindings(new viewModel());