"use strict";

if(document.currentScript && document.currentScript != null) {
    var importDoc = document.currentScript.ownerDocument;
}
else {
    var importDoc = document._currentScript.ownerDocument;
}

var proto = Object.create(HTMLElement.prototype, {
});

Object.defineProperty(proto, "header", { 
    headerLabel : "",
    get : function() {return this.headerLabel},
    set : function(headerLabel) {this.headerLabel = headerLabel}
});

proto.getHeader = function() {
    return this.header;
}

proto.setHeader = function(headerLabel) {
    this.header = headerLabel;

    var header = this.querySelector("complex-filter .title-holder");
    if(!header) {
        header = document.createElement("label");
    }
    header.innerHTML = headerLabel;
    header.setAttribute("class", "title-holder");
    this.appendChild(header);

    this.shadowRoot.querySelector(".auto-complete-input").placeholder = "Search in " + headerLabel;
}

proto.getUniverse = function() {
    return this.listElements;
}

Object.defineProperty(proto, "listElements", { 
    elements : [],
    get : function() {return this.elements},
    set : function(listElements) {this.elements = listElements}
});

proto.fireFilterListChangedEvent = function (checkboxState, checkboxText) {
    if(!this.filterList) {
        this.filterList = [];
    }
    var index = this.filterList.indexOf(checkboxText);
    if(checkboxState) {
        if(index == -1) {
            this.filterList.push(checkboxText);
        }
    }
    else {
        if(index > -1) {
            this.filterList.splice(index, 1);
        }
    }

    var event =  new CustomEvent('filterListChanged', {'detail' : this.filterList});

    this.dispatchEvent(event);
}

proto.setUniverse = function(listElements) {
    console.log("Universe is being set for " + this.getElementsByClassName("title-holder")[0].innerHTML + " with list : " + listElements);

    this.listElements = listElements;

    for(var i in listElements) {
        var tmpDiv = document.createElement("div");
        tmpDiv.style.display = "block";
        tmpDiv.style.marginLeft = "80px";
        var tmpCheck = document.createElement("input");
        tmpCheck.setAttribute("type", "checkbox");

        var protoObj = this;
        tmpCheck.addEventListener("change", function() {
            protoObj.fireFilterListChangedEvent(this.checked, this.parentElement.innerText);
        });
        tmpDiv.appendChild(tmpCheck);
        tmpDiv.appendChild(document.createTextNode(listElements[i]));
        this.shadowRoot.querySelector(".checkbox-div").appendChild(tmpDiv);
    }
};

Object.defineProperty(proto, "filterList", {
    filterElements: [],
    get: function() {return this.filterElements;},
    set: function(filterElements) {this.filterElements = filterElements;}
});

proto.createdCallback = function() {
    var root = this.createShadowRoot();
    var template = document.querySelector("#complexFilterTemplate");
    if(!template) {
        template = importDoc.querySelector("#complexFilterTemplate");
    }

    var headerLabel = this.querySelector(".title-holder");
    if(headerLabel) {
        this.header = headerLabel.innerHTML;
    }

    var clone = document.importNode(template.content, true);

    if(this.header) {
        clone.querySelector(".auto-complete-input").placeholder = "Search in " + this.header;
    }

    //$(clone).find(".checkbox-div").customScrollbar({fixedThumbHeight: 50, fixedThumbWidth: 60});

    root.appendChild(clone);

    var checkboxHolder = this.querySelector("ul");
    var listElements = [];
    if(checkboxHolder) {
        var listItems = checkboxHolder.getElementsByTagName("li");
        for (var i = 0; i < listItems.length; i++) {
           listElements.push(listItems[i].innerHTML);
        }
        this.setUniverse(listElements);
    }

    this.setAutocompleteOnTextBox();
};

proto.setAutocompleteOnTextBox = function() {
    var protoObj = this;
    $(this.shadowRoot).find(".auto-complete-input").keyup(function(event) {
        var tval = $(this).val();
        $(protoObj.shadowRoot).find(".checkbox-div").find("div").hide().filter(":contains('"+tval+"')").find("div").andSelf().show();
    });
};

var ComplexFilter = document.registerElement("complex-filter",{
  prototype : proto
});