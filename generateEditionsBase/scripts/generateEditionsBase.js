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

let Metadata =  function(data) {
    let self = this;
    self.lCIDDec = ko.observable(data.lCIDDec);
    
    self.formTexts = {};    
    self.formTexts.header = ko.observable(data.formTexts.header);
    self.formTexts.headerSubText = ko.observable(data.formTexts.headerSubText);
    self.formTexts.infoText = ko.observable(data.formTexts.infoText);

    self.fieldLabels = {};
    self.fieldLabels.yearOfNewEditions = ko.observable(data.fieldLabels.yearOfNewEditions);
    self.fieldLabels.fromEditionNumber = ko.observable(data.fieldLabels.fromEditionNumber);
    self.fieldLabels.toEditionNumber = ko.observable(data.fieldLabels.toEditionNumber);

    self.actionButtons = {};
    self.actionButtons.okLabel = ko.observable(data.actionButtons.okLabel);
    self.actionButtons.okTitle = ko.observable(data.actionButtons.okTitle);
    self.actionButtons.cancelLabel = ko.observable(data.actionButtons.cancelLabel);
    self.actionButtons.cancelTitle = ko.observable(data.actionButtons.cancelTitle);
}

let GenerateEditionsBaseModel = function(meta, editionsBaseJSONData) {
    let self = this;
    
    self.metadata = new Metadata(meta);
    self.yearOfNewEditions = ko.observable(editionsBaseJSONData.yearOfNewEditions);
    self.fromEditionNumber = ko.observable(editionsBaseJSONData.fromEditionNumber);
    self.toEditionNumber = ko.observable(editionsBaseJSONData.toEditionNumber);
        
    self.isDirty = ko.computed(function() {
        let dirty = currentActivity.dirtyFlag.isDirty() &&
                    currentActivity.dirtyFlag.isDirty() &&
                    currentActivity.dirtyFlag.isDirty();
        return dirty;
    }, self);


    self.clickedOnOk = function (model, event) {
        /*
        let dataToSave = ko.toJSON(self.dirtyItems);
        //save dirty state items to system

        console.log('Saving edited data: '+ dataToSave );
        
        //wait for response, when it arrives
        // updatedActivityCategoryItems = ...
        let updatedActivityCategoryItems = fakeJSONResponseData.map( d => new ActivityCategory(d));
        //update entire model based on this data
        self.activityCategories(updatedActivityCategoryItems);
        */
    }

    self.clickedOnCancel = function (model, event) {
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
        formTexts : { 
            "header" : "Generate Editions - Base",
            "headerSubText" : "Create new editions with base data",
            "infoText" : "Create new editions from publication. This will generate new editions with Base Data from publication and old issues"
        },
        fieldLabels : {
            "yearOfNewEditions" : "Year of new editions",
            "fromEditionNumber" : "From edition number",
            "toEditionNumber" : "To edition number"
        },
        actionButtons : {
            "okLabel" : "Ok",
            "okTitle" : "",
            "cancelLabel" : "Cancel",
            "cancelTitle" : ""
        }
    },
    {
        "yearOfNewEditions" : "",
        "fromEditionNumber" : "",
        "toEditionNumber" : ""
    }
);

 ko.applyBindings(viewModel);