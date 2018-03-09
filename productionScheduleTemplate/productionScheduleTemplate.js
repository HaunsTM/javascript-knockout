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

let Metadata = function (jSONData) {
    let self = this;
    let data = JSON.parse(jSONData);
    
    self.activityName = ko.observable(data.tableHeaderLabels.activityName);
    self.regarding = ko.observable(data.tableHeaderLabels.regarding);
    self.note = ko.observable(data.tableHeaderLabels.note);

    self.dependency = ko.observable(data.tableHeaderLabels.dependency);
    self.daysToAdd = ko.observable(data.tableHeaderLabels.daysToAdd);
    self.time = ko.observable(data.tableHeaderLabels.time);

    self.saveLabel = ko.observable(data.actionButtons.saveLabel);
    self.saveTitle = ko.observable(data.actionButtons.saveTitle);
    
    self.allKeys = {};
}

let Activity = function (lCIDDec, data) {
    let self = this;
    self.entityId = ko.observable(data.entityId);

    self.activityName = ko.observable(data.activityName);
    self.regarding = ko.observable(data.regarding);
    self.note = ko.observable(data.note);

    self.dependency = ko.observable(data.dependency); 
    self.daysToAdd = ko.observable(data.daysToAdd);
    self.time = ko.observable(data.time);

    self.dirtyFlag = new DirtyFlag(self);
}

let ActivityCategory = function (lCIDDec, data) {
    let self = this;
    let activitiesArrayObject = data.activities.map(d => new Activity(lCIDDec, d));
    self.categoryName = ko.observable(data.categoryName);
    self.activities = ko.observableArray(activitiesArrayObject); 
}

let ProductionScheduleTemplateModel = function() {
    let self = this;
    
    // let jsonMeta = GetMetaDataProductionSchedule()
    let jsonMeta = fakeJsonMeta;
    self.metadata = new Metadata(jsonMeta);

    let crmManager = new acando.CrmManager;
    let lCIDDec = crmManager.userLcid;

    //let activityCategoryItemsJSONData = GetActivityCategoryItemsJSONData();
    let activityCategoryItemsJSONData = fakeActivityCategoryItemsJSONData;
    let activityCategoryItems = activityCategoryItemsJSONData.map(d => new ActivityCategory(lCIDDec, d));
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


let fakeJsonMeta = {
    tableHeaderLabels: {
        "activityName": "Aktivitet",
        "regarding": "Angående",
        "note": "Kort beskrivning",
        "date": "Datum",
        "time": "Tid",
        "day": "Dag",
        "dependency": "Beroende",
        "daysToAdd": "Dagar",
        "timeTemplate": "Tid mall",
        "calculatedDayInFuture": "Framräknad Dag"
    },
    gridButtons: {
        "updateGridButtonTitle": "Uppdatera griden baserat på den här raden"
    },
    actionButtons: {
        "saveLabel": "Spara",
        "saveTitle": "Spara till systemet och uppdatera vyn",
        "saveAndCloseLabel": "Spara och stäng",
        "saveAndCloseTitle": "Spara till systemet och stäng vyn"
    }
};

let fakeActivityCategoryItemsJSONData = [
    {
        "categoryName": "Order Dates",
        "activities": [
            {
                "entityId": 1,

                "activityName": "Header Venture booked",
                "regarding": "",
                "note": "Satsningen ska vara anmäld",
                "date": "2017-12-04",
                "time": "00:00",
                "dependency": "Releaseday",
                "daysToAdd": "45",
                "timeTemplate": "00:00:00",
                "calculatedDayInFuture": "2017-12-04"
            },
            {
                "entityId": 2,

                "activityName": "Circulation Deadline Preliminary",
                "regarding": "",
                "note": "Ev preliminär upplaga",
                "date": "",
                "time": "",
                "dependency": "Circulation Deadline Defined",
                "daysToAdd": "",
                "timeTemplate": "00:00:00",
                "calculatedDayInFuture": ""
            },
            {
                "entityId": 3,

                "activityName": "Circulation Deadline Definite",
                "regarding": "",
                "note": "Definitiv upplaga klar",
                "date": "2018-01-19",
                "time": "00:00",
                "dependency": "Bindery Finished Sheet",
                "daysToAdd": "5",
                "timeTemplate": "08:30:00",
                "calculatedDayInFuture": "2018-01-19"
            },
            {
                "entityId": 4,

                "activityName": "Print Order Deadline Preliminary",
                "regarding": "",
                "note": "Ev. preliminär tryckorder",
                "date": "",
                "time": "",
                "dependency": "Print Order Deadline Defined",
                "daysToAdd": "",
                "timeTemplate": "00:00:00",
                "calculatedDayInFuture": ""
            },
            {
                "entityId": 5,

                "activityName": "Print Order Definte",
                "regarding": "",
                "note": "Definitiv tryckorder",
                "date": "2018-01-22",
                "time": "09:00",
                "dependency": "Bindery Finished Sheet",
                "daysToAdd": "4",
                "timeTemplate": "09:00:00",
                "calculatedDayInFuture": "2018-01-22"
            }
        ]
    },
    {
        "categoryName": "Repro",
        "activities": [
            {
                "entityId": 6,
                "activityName": "Sheet Repro",
                "regarding": "Ark 1",
                "note": "TV-sidor till ES senast 12.00",
                "date": "2018-01-23",
                "time": "00:00",
                "dependency": "Printing",
                "daysToAdd": "",
                "timeTemplate": "00:00:00",
                "calculatedDayInFuture": "2018-01-23"
            },
            {
                "entityId": 7,
                "activityName": "Sheet Repro",
                "regarding": "Ark 2",
                "note": "Lämning nästa vecka + tablå",
                "date": "2018-01-23",
                "time": "00:00",
                "dependency": "Printing",
                "daysToAdd": "",
                "timeTemplate": "00:00:00",
                "calculatedDayInFuture": "2018-01-23"
            },
            {
                "entityId": 8,
                "activityName": "Sheet Repro",
                "regarding": "Ark 3 Kryss",
                "note": "Slutlämning exkl sena sidor",
                "date": "2018-01-23",
                "time": "00:00",
                "dependency": "Printing",
                "daysToAdd": "",
                "timeTemplate": "00:00:00",
                "calculatedDayInFuture": "2018-01-23"
            }
        ]
    }
];


let viewModel = new ProductionScheduleModel();

let InitiateAndLoadForm = function () {
    //get metadata from external source
    let localizedgroupname = "Crm.Allermedia.Silverlight.ProductionSchema";

    let crmManager = new acando.CrmManager;
    let pumaService = new acando.AllerPumaService();
    let languagecode = crmManager.userLcid;

    pumaService.getTranslations(languagecode, localizedgroupname)
        .then(function (translationsData) {
            let viewModel = new GenerateEditionsModel(translationsData);
            ko.applyBindings(viewModel);
        });
}

InitiateAndLoadForm();