let showTabContent = function(evt, tabContainerToDisplayId) {
    let self = this;
    let tabListClassName="tab-link";
    let tabContentClassName="tab-content";
    let activeClassName = "active"
    let allMenuItemSiblings = Array.prototype.slice.call(evt.currentTarget.parentNode.children);
    let allContainerItemSiblings = Array.prototype.slice.call(document.getElementById(tabContainerToDisplayId).parentNode.children);

    //set active class on clicked menu item (remove on others)
    for (let i = 0; i < allMenuItemSiblings.length; i++) {
        let currentElement = allMenuItemSiblings[i];
        let isTabListItem = currentElement.classList.contains(tabListClassName);
        if (isTabListItem){
            if(currentElement === evt.currentTarget){
                currentElement.className += " " + activeClassName;
            } else {
                currentElement.classList.remove(activeClassName);
            }
        }
    }    

    for (let i = 0; i < allContainerItemSiblings.length; i++) {
        let currentElement = allContainerItemSiblings[i];
        let isContainerItem = currentElement.classList.contains(tabContentClassName);
        if (isContainerItem){
            if(currentElement === document.getElementById(tabContainerToDisplayId)){
                currentElement.className += " " + activeClassName;
            } else {
                currentElement.classList.remove(activeClassName);
            }
        }
    }
}