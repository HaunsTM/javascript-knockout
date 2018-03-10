'use strict';

let Metadata =   function (jSONData) {
    let self = this;
    let data = JSON.parse(jSONData);
    
    self.allKeys = {};
    self.allKeys.btn_UpdateCirculations = ko.observable(data.btn_UpdateCirculations);
    self.allKeys.btn_UpdateComments = ko.observable(data.btn_UpdateComments);
    self.allKeys.btn_UpdateEditions = ko.observable(data.btn_UpdateEditions);
    self.allKeys.btn_UpdatePrintComments = ko.observable(data.btn_UpdatePrintComments);
    self.allKeys.btn_UpdateSheets = ko.observable(data.btn_UpdateSheets);
    self.allKeys.ButtonCancelCaption = ko.observable(data.ButtonCancelCaption);
    self.allKeys.ButtonOkCaption = ko.observable(data.ButtonOkCaption);
    self.allKeys.ChooseCirculationsCaption = ko.observable(data.ChooseCirculationsCaption);
    self.allKeys.ChooseSheetsCaption = ko.observable(data.ChooseSheetsCaption);
    self.allKeys.Description_Edition = ko.observable(data.Description_Edition);
    self.allKeys.Description_StdCirculation = ko.observable(data.Description_StdCirculation);
    self.allKeys.Description_StdSheet = ko.observable(data.Description_StdSheet);
    self.allKeys.Description_Title = ko.observable(data.Description_Title);
    self.allKeys.Description_UpdateEditions = ko.observable(data.Description_UpdateEditions);
    self.allKeys.DialogHeaderDescr_UpdateEditions = ko.observable(data.DialogHeaderDescr_UpdateEditions);
    self.allKeys.DialogTextTitle_UpdateEditions = ko.observable(data.DialogTextTitle_UpdateEditions);
    self.allKeys.FromEditionNumberNotValid = ko.observable(data.FromEditionNumberNotValid);
    self.allKeys.FromEdtionNumberCaption = ko.observable(data.FromEdtionNumberCaption);
    self.allKeys.grd_commentText = ko.observable(data.grd_commentText);
    self.allKeys.grd_commentTitle = ko.observable(data.grd_commentTitle);
    self.allKeys.grd_defQuantity = ko.observable(data.grd_defQuantity);
    self.allKeys.grd_normalPrice = ko.observable(data.grd_normalPrice);
    self.allKeys.grd_pagina = ko.observable(data.grd_pagina);
    self.allKeys.grd_paper = ko.observable(data.grd_paper);
    self.allKeys.grd_stdCirculation = ko.observable(data.grd_stdCirculation);
    self.allKeys.grd_stdSheet = ko.observable(data.grd_stdSheet);
    self.allKeys.lbl_AdvertisingPages = ko.observable(data.lbl_AdvertisingPages);
    self.allKeys.lbl_BarterPages = ko.observable(data.lbl_BarterPages);
    self.allKeys.lbl_BudgetedExtent = ko.observable(data.lbl_BudgetedExtent);
    self.allKeys.lbl_CoverPages = ko.observable(data.lbl_CoverPages);
    self.allKeys.lbl_CrosswordPages = ko.observable(data.lbl_CrosswordPages);
    self.allKeys.lbl_DefinitiveExtent = ko.observable(data.lbl_DefinitiveExtent);
    self.allKeys.lbl_DefQuantity = ko.observable(data.lbl_DefQuantity);
    self.allKeys.lbl_EditorialPages = ko.observable(data.lbl_EditorialPages);
    self.allKeys.lbl_NormalExtent = ko.observable(data.lbl_NormalExtent);
    self.allKeys.lbl_NormalQuantityMax = ko.observable(data.lbl_NormalQuantityMax);
    self.allKeys.lbl_NormalQuantityMin = ko.observable(data.lbl_NormalQuantityMin);
    self.allKeys.lbl_NumberOfPages = ko.observable(data.lbl_NumberOfPages);
    self.allKeys.lbl_Ordinal = ko.observable(data.lbl_Ordinal);
    self.allKeys.lbl_PaginaBackFromPage = ko.observable(data.lbl_PaginaBackFromPage);
    self.allKeys.lbl_PaginaBackToPage = ko.observable(data.lbl_PaginaBackToPage);
    self.allKeys.lbl_PaginaFrontFromPage = ko.observable(data.lbl_PaginaFrontFromPage);
    self.allKeys.lbl_PaginaFrontToPage = ko.observable(data.lbl_PaginaFrontToPage);
    self.allKeys.lbl_TabEdition = ko.observable(data.lbl_TabEdition);
    self.allKeys.lbl_TabEditionsPrintNotes = ko.observable(data.lbl_TabEditionsPrintNotes);
    self.allKeys.lbl_TabNotes = ko.observable(data.lbl_TabNotes);
    self.allKeys.lbl_TabStdCirculation = ko.observable(data.lbl_TabStdCirculation);
    self.allKeys.lbl_TabStdCirculations_Fields = ko.observable(data.lbl_TabStdCirculations_Fields);
    self.allKeys.lbl_TabStdSheet = ko.observable(data.lbl_TabStdSheet);
    self.allKeys.lbl_TabTitle = ko.observable(data.lbl_TabTitle);
    self.allKeys.lbl_TotalNrOfPages = ko.observable(data.lbl_TotalNrOfPages);
    self.allKeys.ToEdtionNumberCaption = ko.observable(data.ToEdtionNumberCaption);
    self.allKeys.YearNotValid = ko.observable(data.YearNotValid);
    self.allKeys.YearTextCaption = ko.observable(data.YearTextCaption);
}

let ProductionScheduleModel = function(translationsData, activityCategoryItemsJSONData) {
    let self = this;
    
    self.metadata = new Metadata(translationsData);
    
}

let fakeMetaData = {  
    "btn_UpdateCirculations":"Uppdatera upplagor",
    "btn_UpdateComments":"Uppdatera kommentarer",
    "btn_UpdateEditions":"Uppdatera utgåvor",
    "btn_UpdatePrintComments":"Uppdatera tryckkommentarer",
    "btn_UpdateSheets":"Uppdatera ark",
    "ButtonCancelCaption":"Avbryt",
    "ButtonOkCaption":"OK",
    "ChooseCirculationsCaption":"Välj standardupplagan du vill uppdatera nedan (endast en i taget kan uppdateras).",
    "ChooseSheetsCaption":"Välj det standardark du vill uppdatera nedan (endast ett i taget kan uppdateras).",
    "Description_Edition":"Här kan du uppdatera befintliga utgåvor genom att ange nya värden nedan (Endast existerande utgåvor kommer få det nya värdet). Ange inom vilket intervall ändringen ska gälla och tryck på knappen när du är klar.",
    "Description_StdCirculation":"Uppdatera data på befintliga upplagor genom att välja en standardupplaga och ange det nya värdet nedan (Endast ärvda upplagor kommer få det nya värdet). Ange inom vilket intervall ändringen ska gälla och tryck på knappen när du är klar.",
    "Description_StdSheet":"Uppdatera värde på befintliga ark genom att välja ett standardark och ange de nya värden som ska uppdateras (Endast ärvda upplagor kommer få det nya värdet). Ange inom vilket intervall ändringen ska gälla och tryck på knappen när du är klar.",
    "Description_Title":"Uppdatera data från titel. Välj standardupplaga, standardark eller kommentarer som ska uppdateras. Den valda entitetens data kommer att uppdateras på existerande ärvda entiteter, om de inte existerar kommer de att skapas. Ange inom vilket intervall av utgåvor ändringen ska gälla och tryck på knappen när du är klar.",
    "Description_UpdateEditions":"Uppdatera befintliga utgåvor. Det här kommer uppdatera utgåvorna med vald data från titel och gamla nummer.",
    "DialogHeaderDescr_UpdateEditions":"Uppdatera befintliga utgåvor med data",
    "DialogTextTitle_UpdateEditions":"Uppdatera utgåvor",
    "FromEditionNumberNotValid":"\"Från utgåva\" är inte inom giltigt urval",
    "FromEdtionNumberCaption":"Från utgåva (nr)",
    "grd_commentText":"Text",
    "grd_commentTitle":"Rubrik",
    "grd_defQuantity":"Definitivt antal",
    "grd_normalPrice":"Normalt pris",
    "grd_pagina":"Pagina",
    "grd_paper":"Papper",
    "grd_stdCirculation":"Standardupplaga",
    "grd_stdSheet":"Standardark",
    "lbl_AdvertisingPages":"Annonssidor:",
    "lbl_BarterPages":"Bartersidor:",
    "lbl_BudgetedExtent":"Budgeterat omfång",
    "lbl_CoverPages":"Omslagssidor:",
    "lbl_CrosswordPages":"Korsordssidor:",
    "lbl_DefinitiveExtent":"Definitivt Omfång",
    "lbl_DefQuantity":"Definitivt antal:",
    "lbl_EditorialPages":"Redaktionella sidor:",
    "lbl_NormalExtent":"Normalt omfång",
    "lbl_NormalQuantityMax":"Normal Upplaga (Max):",
    "lbl_NormalQuantityMin":"Normal Upplaga (Min):",
    "lbl_NumberOfPages":"Sidantal:",
    "lbl_Ordinal":"Ordningstal:",
    "lbl_PaginaBackFromPage":"Pagina Bak från sida:",
    "lbl_PaginaBackToPage":"Pagina Bak till sida:",
    "lbl_PaginaFrontFromPage":"Pagina Fram från sida:",
    "lbl_PaginaFrontToPage":"Pagina Fram till sida:",
    "lbl_TabEdition":"Utgåva",
    "lbl_TabEditionsPrintNotes":"Tryckkommentarer",
    "lbl_TabNotes":"Kommentar",
    "lbl_TabStdCirculation":"Standardupplaga",
    "lbl_TabStdCirculations_Fields":"Fält",
    "lbl_TabStdSheet":"Standardark",
    "lbl_TabTitle":"Titel",
    "lbl_TotalNrOfPages":"Totalt antal sidor:",
    "ToEdtionNumberCaption":"Till utgåva (nr)",
    "YearNotValid":"Årtalet är inte giltigt",
    "YearTextCaption":"Årtal för nya utgåvor"
 };


let viewModel = new ProductionScheduleModel(JSON.stringify(fakeMetaData));

ko.applyBindings(viewModel);