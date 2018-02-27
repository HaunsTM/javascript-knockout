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

var Metadata =   function(lCIDDec, tableHeaderLabels) {
    var self = this;
    self.entityId = ko.observable(entityId);
}

var TableHeaderLabels = function (activityName, regarding, note, date, time, day, dependency, daysToAdd, timeTemplate, calculatedDayInFuture) {
    var self = this;
    self.activityName = ko.observable(activityName);
    self.regarding = ko.observable(regarding);
    self.note = ko.observable(note);
    self.date = ko.observable(date);
    self.time = ko.observable(time);
    self.day = ko.observable(day);
    self.dependency = ko.observable(dependency);
    self.daysToAdd = ko.observable(daysToAdd);
    self.timeTemplate = ko.observable(timeTemplate);
    self.calculatedDayInFuture = ko.observable(calculatedDayInFuture);
}


var Activity = function (entityId, activityName, regarding, note, date, time, dependency, daysToAdd, timeTemplate, calculatedDayInFuture) {
    var self = this;
    self.entityId = ko.observable(entityId);

    self.activityName = ko.observable(activityName);
    self.regarding = ko.observable(regarding);
    self.note = ko.observable(note);

    self.date = ko.observable(date);
    self.time = ko.observable(time);
    self.day = ko.pureComputed({
        read: function () {
            var svLCIDDec = "1053";
            var timeCalculator = new namespace.TimeCalculator();
            var dateObject = new Date(self.date());

            return timeCalculator.getDayNameByLocaleCountryIdDecimal(dateObject, svLCIDDec);
        },
        owner: this
    });

    self.dependency = ko.observable(dependency);
    self.daysToAdd = ko.observable(daysToAdd);
    self.timeTemplate = ko.observable(timeTemplate);

    self.calculatedDayInFuture = ko.observable(calculatedDayInFuture);

    self.dirtyFlag = new ko.dirtyFlag(self);
}

var ActivityCategory = function (categoryName, activities) {
    var self = this;
    self.categoryName = ko.observable(categoryName);
    self.activities = ko.observableArray(activities); 
}

var ProductionScheduleModel = function(metadata, items) {
    var self = this;
    
    self.activityCategories = ko.observableArray(items);
    
    self.dirtyItems = ko.computed(function() {
        var tempDirtyItems = [];
        var activityCategories = self.activityCategories();
        var currentActivityCategoryIndex = activityCategories.length;

        while (currentActivityCategoryIndex--) {
            var currentActivityCategory = activityCategories[currentActivityCategoryIndex];
            console.log(currentActivityCategory.categoryName())

            var currentActivities = currentActivityCategory.activities();
            var currentActivityIndex = currentActivities.length;

            while (currentActivityIndex--) {
                var currentActivity = currentActivities[currentActivityIndex];
                
                if (currentActivity.dirtyFlag.isDirty()){
                    tempDirtyItems.push(currentActivity);
                }
            }
        }

        return tempDirtyItems;
        
    }, self);
    
    self.isDirty = ko.computed(function() {
        return this.dirtyItems().length > 0;
    }, self);

    self.calculateGridBasedOnThisRow = function (activity) {        
        var dataThatGridShouldBeRecalculatedOn = ko.toJSON(activity);
        //send dataThatGridShouldBeRecalculatedOn to server
        //wait for response, when it arrives
        console.log( dataThatGridShouldBeRecalculatedOn);
    };

    self.clickedOnSave = function (model, event) {
        var dataToSave = ko.toJSON(self.dirtyItems);
        console.log('Saving data: '+ dataToSave );
        self.activityCategories(viewModel1);
    }

    self.clickedOnSaveAndExit = function (model, event) {        
        console.log('Closing');
    };
}

var viewModel = new ProductionScheduleModel({
    lCIDDec : "1053"
},
    
    [
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

var viewModel1 = [
    new ActivityCategory("Order Dates", [
            new Activity(1, "1 Header Venture booked", "", "Satsningen ska vara anmäld", "2017-12-04", "00:00", "Releaseday", "45", "00:00:00", "2017-12-04"),
            new Activity(2, "1 Circulation Deadline Preliminary", "", "Ev preliminär upplaga", "", "", "Circulation Deadline Defined", "", "00:00:00", ""),
            new Activity(3, "1 Circulation Deadline Definite", "", "Definitiv upplaga klar", "2018-01-19", "00:00", "Bindery Finished Sheet", "5", "08:30:00", "2018-01-19"),                
            new Activity(4, "1 Print Order Deadline Preliminary", "", "Ev. preliminär tryckorder", "", "", "Print Order Deadline Defined", "", "00:00:00", ""),
            new Activity(5, "1 Print Order Definte", "", "Definitiv tryckorder", "2018-01-22", "09:00", "Bindery Finished Sheet", "4", "09:00:00", "2018-01-22"),
        ]
    ),
    new ActivityCategory("Repro", [
            new Activity(6, "1 Sheet Repro", "Ark 1", "TV-sidor till ES senast 12.00", "2018-01-23", "00:00", "Printing", "", "00:00:00", "2018-01-23"),
            new Activity(7, "1 Sheet Repro", "Ark 2", "Lämning nästa vecka + tablå", "2018-01-23", "00:00", "Printing", "", "00:00:00", "2018-01-23"),
            new Activity(8, "1 Sheet Repro", "Ark 3 Kryss", "Slutlämning exkl sena sidor", "2018-01-23", "00:00", "Printing", "", "00:00:00", "2018-01-23"),
        ]
    )
];

ko.applyBindings(viewModel);