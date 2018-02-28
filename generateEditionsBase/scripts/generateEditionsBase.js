'use strict';

/**
 * Dirty:
 * http://jsfiddle.net/rniemeyer/dtpfv/
 * 
 * Multiple categories:
 * http://jsfiddle.net/bZhCk/280/
 */
 
let DirtyFlag = function(root, isInitiallyDirty) {
    let result = function() {},
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

let Metadata =   function(data) {
    let self = this;
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

let Activity = function (data) {
    let self = this;
    self.entityId = ko.observable(data.entityId);

    self.activityName = ko.observable(data.activityName);
    self.regarding = ko.observable(data.regarding);
    self.note = ko.observable(data.note);

    self.date = ko.observable(data.date);
    self.time = ko.observable(data.time);
    self.day = ko.pureComputed({
        read: function () {
            let svLCIDDec = "1053";
            let timeCalculator = new namespace.TimeCalculator();
            let dateObject = new Date(self.date());

            return timeCalculator.getDayNameByLocaleCountryIdDecimal(dateObject, svLCIDDec);
        },
        owner: this
    });

    self.dependency = ko.observable(data.dependency);
    self.daysToAdd = ko.observable(data.daysToAdd);
    self.timeTemplate = ko.observable(data.timeTemplate);

    self.calculatedDayInFuture = ko.observable(data.calculatedDayInFuture);

    self.dirtyFlag = new DirtyFlag(self);
}

let ActivityCategory = function (data) {
    let self = this;
    let activitiesArrayObject = data.activities.map( d => new Activity(d));
    self.categoryName = ko.observable(data.categoryName);
    self.activities = ko.observableArray(activitiesArrayObject); 
}

let GenerateEditionsBaseModel = function(data, activityCategoryItemsJSONData) {
    let self = this;
    
    self.metadata = new Metadata(data);

    let activityCategoryItems = activityCategoryItemsJSONData.map( d => new ActivityCategory(d));
    self.activityCategories = ko.observableArray(activityCategoryItems);
    
    self.dirtyItems = ko.computed(function() {
        let tempDirtyItems = [];
        let activityCategories = self.activityCategories();
        let currentActivityCategoryIndex = activityCategories.length;

        while (currentActivityCategoryIndex--) {
            let currentActivityCategory = activityCategories[currentActivityCategoryIndex];

            let currentActivities = currentActivityCategory.activities();
            let currentActivityIndex = currentActivities.length;

            while (currentActivityIndex--) {
                let currentActivity = currentActivities[currentActivityIndex];
                
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
        let dataThatGridShouldBeRecalculatedOn = ko.toJSON(activity);
            
        //send dataThatGridShouldBeRecalculatedOn to server
        
        //wait for response, when it arrives
        // fakeJSONResponseData = ...
        let updatedActivityCategoryItems = fakeJSONResponseData.map( d => new ActivityCategory(d));
        //update entire model based on this data
        self.activityCategories(updatedActivityCategoryItems);

        console.log("Recalculated grid based on: " + dataThatGridShouldBeRecalculatedOn);        
    };

    self.clickedOnSave = function (model, event) {
        let dataToSave = ko.toJSON(self.dirtyItems);
        //save dirty state items to system

        console.log('Saving edited data: '+ dataToSave );
        
        //wait for response, when it arrives
        // updatedActivityCategoryItems = ...
        let updatedActivityCategoryItems = fakeJSONResponseData.map( d => new ActivityCategory(d));
        //update entire model based on this data
        self.activityCategories(updatedActivityCategoryItems);
    }

    self.clickedOnSaveAndExit = function (model, event) {
        let dataToSave = ko.toJSON(self.dirtyItems);
        //save dirty state items to system

        console.log('Saving edited data: '+ dataToSave );
        
        //wait for response, when it arrives
        // updatedActivityCategoryItems = ...
        let updatedActivityCategoryItems = fakeJSONResponseData.map( d => new ActivityCategory(d));
        //update entire model based on this data
        self.activityCategories(updatedActivityCategoryItems);

        //close view
        console.log('Closing');
    };
}

let viewModel = new GenerateEditionsBaseModel(
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
        {
           "categoryName":"Order Dates",
           "activities":[
              {
                 "entityId":1,
                 "activityName":"Header Venture booked",
                 "regarding":"",
                 "note":"Satsningen ska vara anmäld",
                 "date":"2017-12-04",
                 "time":"00:00",
                 "dependency":"Releaseday",
                 "daysToAdd":"45",
                 "timeTemplate":"00:00:00",
                 "calculatedDayInFuture":"2017-12-04"
              },
              {
                 "entityId":2,
                 "activityName":"Circulation Deadline Preliminary",
                 "regarding":"",
                 "note":"Ev preliminär upplaga",
                 "date":"",
                 "time":"",
                 "dependency":"Circulation Deadline Defined",
                 "daysToAdd":"",
                 "timeTemplate":"00:00:00",
                 "calculatedDayInFuture":""
              },
              {
                 "entityId":3,
                 "activityName":"Circulation Deadline Definite",
                 "regarding":"",
                 "note":"Definitiv upplaga klar",
                 "date":"2018-01-19",
                 "time":"00:00",
                 "dependency":"Bindery Finished Sheet",
                 "daysToAdd":"5",
                 "timeTemplate":"08:30:00",
                 "calculatedDayInFuture":"2018-01-19"
              },
              {
                 "entityId":4,
                 "activityName":"Print Order Deadline Preliminary",
                 "regarding":"",
                 "note":"Ev. preliminär tryckorder",
                 "date":"",
                 "time":"",
                 "dependency":"Print Order Deadline Defined",
                 "daysToAdd":"",
                 "timeTemplate":"00:00:00",
                 "calculatedDayInFuture":""
              },
              {
                 "entityId":5,
                 "activityName":"Print Order Definte",
                 "regarding":"",
                 "note":"Definitiv tryckorder",
                 "date":"2018-01-22",
                 "time":"09:00",
                 "dependency":"Bindery Finished Sheet",
                 "daysToAdd":"4",
                 "timeTemplate":"09:00:00",
                 "calculatedDayInFuture":"2018-01-22"
              }
           ]
        },
        {
           "categoryName":"Repro",
           "activities":[
              {
                 "entityId":6,
                 "activityName":"Sheet Repro",
                 "regarding":"Ark 1",
                 "note":"TV-sidor till ES senast 12.00",
                 "date":"2018-01-23",
                 "time":"00:00",
                 "dependency":"Printing",
                 "daysToAdd":"",
                 "timeTemplate":"00:00:00",
                 "calculatedDayInFuture":"2018-01-23"
              },
              {
                 "entityId":7,
                 "activityName":"Sheet Repro",
                 "regarding":"Ark 2",
                 "note":"Lämning nästa vecka + tablå",
                 "date":"2018-01-23",
                 "time":"00:00",
                 "dependency":"Printing",
                 "daysToAdd":"",
                 "timeTemplate":"00:00:00",
                 "calculatedDayInFuture":"2018-01-23"
              },
              {
                 "entityId":8,
                 "activityName":"Sheet Repro",
                 "regarding":"Ark 3 Kryss",
                 "note":"Slutlämning exkl sena sidor",
                 "date":"2018-01-23",
                 "time":"00:00",
                 "dependency":"Printing",
                 "daysToAdd":"",
                 "timeTemplate":"00:00:00",
                 "calculatedDayInFuture":"2018-01-23"
              }
           ]
        },
        {
           "categoryName":"Sheet Printing",
           "activities":[
              {
                 "entityId":9,
                 "activityName":"Printing",
                 "regarding":"Ark 1",
                 "note":"Ark ska lämnas till tryck",
                 "date":"2018-01-23",
                 "time":"15:00",
                 "dependency":"Bindery Finished Sheet",
                 "daysToAdd":"3",
                 "timeTemplate":"15:00:00",
                 "calculatedDayInFuture":"2018-01-23"
              },
              {
                 "entityId":10,
                 "activityName":"Printing",
                 "regarding":"Ark 2",
                 "note":"Ark ska lämnas till tryck",
                 "date":"2018-01-23",
                 "time":"15:00",
                 "dependency":"Bindery Finished Sheet",
                 "daysToAdd":"3",
                 "timeTemplate":"15:00:00",
                 "calculatedDayInFuture":"2018-01-23"
              },
              {
                 "entityId":11,
                 "activityName":"Printing",
                 "regarding":"Ark 3 Kryss",
                 "note":"Ark ska lämnas till tryck",
                 "date":"2018-01-23",
                 "time":"15:00",
                 "dependency":"Bindery Finished Sheet",
                 "daysToAdd":"3",
                 "timeTemplate":"15:00:00",
                 "calculatedDayInFuture":"2018-01-23"
              }
           ]
        },
        {
           "categoryName":"Binding",
           "activities":[
              {
                 "entityId":12,
                 "activityName":"Bindery Fished Sheet",
                 "regarding":"",
                 "note":"Ark till häftning",
                 "date":"2018-01-26",
                 "time":"00:00",
                 "dependency":"Edition Bindery",
                 "daysToAdd":"0",
                 "timeTemplate":"00:00:00",
                 "calculatedDayInFuture":"2018-01-26"
              },
              {
                 "entityId":13,
                 "activityName":"Edition Bindery",
                 "regarding":"",
                 "note":"Normal bindningsstart",
                 "date":"2018-01-26",
                 "time":"00:00",
                 "dependency":"Releaseday",
                 "daysToAdd":"9",
                 "timeTemplate":"00:00:00",
                 "calculatedDayInFuture":"2018-01-26"
              }
           ]
        }
     ]);

let fakeJSONResponseData = [
    {
       "categoryName":"Fake update Binding",
       "activities":[
          {
             "entityId":12,
             "activityName":"update: Bindery Fished Sheet",
             "regarding":"",
             "note":"Ark till häftning",
             "date":"2018-01-26",
             "time":"00:00",
             "dependency":"Edition Bindery",
             "daysToAdd":"0",
             "timeTemplate":"00:00:00",
             "calculatedDayInFuture":"2018-01-26"
          },
          {
             "entityId":13,
             "activityName":"update: Edition Bindery",
             "regarding":"",
             "note":"Normal bindningsstart",
             "date":"2018-01-26",
             "time":"00:00",
             "dependency":"Releaseday",
             "daysToAdd":"9",
             "timeTemplate":"00:00:00",
             "calculatedDayInFuture":"2018-01-26"
          }
       ]
    },
    {
       "categoryName":"Fake update Repro",
       "activities":[
          {
             "entityId":6,
             "activityName":"update: Sheet Repro",
             "regarding":"Ark 1",
             "note":"TV-sidor till ES senast 12.00",
             "date":"2018-01-23",
             "time":"00:00",
             "dependency":"Printing",
             "daysToAdd":"",
             "timeTemplate":"00:00:00",
             "calculatedDayInFuture":"2018-01-23"
          },
          {
             "entityId":7,
             "activityName":"update: Sheet Repro",
             "regarding":"Ark 2",
             "note":"Lämning nästa vecka + tablå",
             "date":"2018-01-23",
             "time":"00:00",
             "dependency":"Printing",
             "daysToAdd":"",
             "timeTemplate":"00:00:00",
             "calculatedDayInFuture":"2018-01-23"
          },
          {
             "entityId":8,
             "activityName":"update: Sheet Repro",
             "regarding":"Ark 3 Kryss",
             "note":"Slutlämning exkl sena sidor",
             "date":"2018-01-23",
             "time":"00:00",
             "dependency":"Printing",
             "daysToAdd":"",
             "timeTemplate":"00:00:00",
             "calculatedDayInFuture":"2018-01-23"
          }
       ]
    }
 ];

 ko.applyBindings(viewModel);