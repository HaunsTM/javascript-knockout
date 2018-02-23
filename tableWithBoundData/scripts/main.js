'use strict';

/**
 * http://jsfiddle.net/rniemeyer/dtpfv/
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


function Item(entityId, activityName, regarding, note, date, time, dependency, daysToAdd) {
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
    this.timeTemplate = ko.observable();

    this.calculatedDayInFuture = ko.observable();

    this.btnCalculateGrid = ko.observable();

    this.dirtyFlag = new ko.dirtyFlag(this);
}

var ViewModel = function(items) {
    this.items = ko.observableArray([
        new Item(1, "Header Venture booked", "", "Satsningen ska vara anmäld", "2017-12-04", "00:00", "Releaseday", "45"),
        new Item(2, "Circulation Deadline Preliminary", "", "Ev preliminär upplaga", "", "", "dependency", "")
    ]);
    
    this.save = function() {
        alert("Sending changes to server: " + ko.toJSON(this.dirtyItems));  
    };
    
    this.dirtyItems = ko.computed(function() {
        return ko.utils.arrayFilter(this.items(), function(item) {
            return item.dirtyFlag.isDirty();
        });
    }, this);
    
    this.isDirty = ko.computed(function() {
        return this.dirtyItems().length > 0;
    }, this);
};

ko.applyBindings(new ViewModel());