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

var Metadata =   function(data) {
    var self = this;
    self.lCIDDec = ko.observable(data.lCIDDec);
    
    self.activityName = ko.observable(data.tableHeaderLabels.activityName);
    self.regarding = ko.observable(data.tableHeaderLabels.regarding);
    self.note = ko.observable(data.tableHeaderLabels.note);
    self.date = ko.observable(data.tableHeaderLabels.date);
    self.time = ko.observable(data.tableHeaderLabels.time);
    self.day = ko.observable(data.tableHeaderLabels.day);
    self.dependency = ko.observable(data.tableHeaderLabels.dependency);
    self.daysToAdd = ko.observable(data.tableHeaderLabels.daysToAdd);
    self.timeTemplate = ko.observable(data.tableHeaderLabels.timeTemplate);
    self.calculatedDayInFuture = ko.observable(data.tableHeaderLabels.calculatedDayInFuture);
    
    self.updateGridButtonTitle = ko.observable(data.gridButtons.updateGridButtonTitle);
        
    self.saveLabel = ko.observable(data.actionButtons.saveLabel);
    self.saveTitle = ko.observable(data.actionButtons.saveTitle);
    self.saveAndCloseLabel = ko.observable(data.actionButtons.saveAndCloseLabel);
    self.saveAndCloseTitle = ko.observable(data.actionButtons.saveAndCloseTitle);
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

var ProductionScheduleModel = function(data, items) {
    var self = this;
    
    self.metadata = new Metadata(data);
    
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
        //send dataThatGridShouldBeRecalculatedOn to server
        //wait for response, when it arrives, update entire model based on this data
        var dataThatGridShouldBeRecalculatedOn = ko.toJSON(activity);
        
        //TODO: Reset dirty state after updating model!
        self.activityCategories(fakeJSONResponseData);
        console.log("Recalculated grid based on: " + dataThatGridShouldBeRecalculatedOn);        
    };

    self.clickedOnSave = function (model, event) {
        //save dirty state items to system
        var dataToSave = ko.toJSON(self.dirtyItems);
        console.log('Saving edited data: '+ dataToSave );
    }

    self.clickedOnSaveAndExit = function (model, event) {        
        //save dirty state items to system
        var dataToSave = ko.toJSON(self.dirtyItems);
        console.log('Saving edited data: '+ dataToSave );

        //close view
        console.log('Closing');
    };
}

var viewModel = new ProductionScheduleModel(
    //Here we add some settings data
    {
        lCIDDec : "1053", 
        tableHeaderLabels : { 
            "activityName" : "Aktivitet", 
            "regarding" : "Angående", 
            "note" : "Kort beskrivning", 
            "date" : "Datum", 
            "time" : "Tid", 
            "day" : "Dag", 
            "dependency" : "Beroende", 
            "daysToAdd" : "Dagar", 
            "timeTemplate" : "Tid mall", 
            "calculatedDayInFuture" : "Framräknad Dag"
        },
        gridButtons : {
            "updateGridButtonTitle" : "Uppdatera griden baserat på den här raden"
        },
        actionButtons : {
            "saveLabel" : "Spara",
            "saveTitle" : "Spara till systemet och uppdatera vyn",
            "saveAndCloseLabel" : "Spara och stäng",
            "saveAndCloseTitle" : "Spara till systemet och stäng vyn"
        }
    }, 
    //here we add some initial data
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

var fakeJSONResponseData = [
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