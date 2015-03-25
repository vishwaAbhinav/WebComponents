"use strict";
const CustomFilter = (function () {
    document.currentScript = document.currentScript || document._currentScript;
    var importDoc = document.currentScript.ownerDocument;

    // private static
    var nextId = 1;

    function _setHeader(self) {
        var header = self.querySelector("custom-filter title-holder");
        if(!header) {
            header = document.createElement("title-holder");
        }
        header.innerHTML = self.header;
        self.appendChild(header);

        self.shadowRoot.querySelector(".auto-complete-input").placeholder = "Search in " + self.header;
    }

    function _setVisibleElements(self) {
        var checkboxHeight = self.shadowRoot.querySelector(".checkbox-div").style.height = (+self.visibleElements * +2.5) + "ex";
        self.shadowRoot.querySelector(".outer").style.height = +checkboxHeight.replace(/[^-\d\.]/g, '') + +6.5 + "ex";
    }

    function _initialize(self) {
        var root = self.createShadowRoot();
        var template = document.querySelector("#complexFilterTemplate");
        if(!template) {
            template = importDoc.querySelector("#complexFilterTemplate");
        }

        var clone = document.importNode(template.content, true);
        root.appendChild(clone);

        var headerLabel = self.querySelector("title-holder");
        if(headerLabel) {
            self.header = headerLabel.innerHTML;
        }

        var checkboxHolder = self.querySelector("ul");
        var listElements = [];
        if(checkboxHolder) {
            var listItems = checkboxHolder.getElementsByTagName("li");
            for (var i = 0; i < listItems.length; i++) {
               listElements.push(listItems[i].innerHTML);
            }
            self.universe = listElements;
        }

        //Setting default visible elements to 4
        self.visibleElements = 4;

        _setAutocompleteOnTextBox(self);
        _makeCheckboxDivCollapsable(self);
    }

    function _makeCheckboxDivCollapsable(self) {
        $(self.shadowRoot).find(".toggle").click(function(event) {
            if($(self.shadowRoot).find(".checkbox-div").is(":visible")) {
                $(self.shadowRoot).find(".checkbox-div").hide();
                $(self.shadowRoot).find(".auto-complete-input").hide();
                $(self.shadowRoot).find(".outer").height("2.5ex");
                $(self.shadowRoot).find(".toggle").addClass("toggleClicked").removeClass("toggle");
            }
            else {
                $(self.shadowRoot).find(".checkbox-div").show();
                $(self.shadowRoot).find(".auto-complete-input").show();
                $(self.shadowRoot).find(".outer").height((+self.visibleElements * +2.5) + +6.5 + "ex");
                $(self.shadowRoot).find(".toggleClicked").addClass("toggle").removeClass("toggleClicked");
            }
        });
    }

    function _setAutocompleteOnTextBox(self){
        $(self.shadowRoot).find(".auto-complete-input").keyup(function(event) {
            var tval = $(this).val();
            $(self.shadowRoot).find(".checkbox-div").find("div").hide().filter(":contains('"+tval+"')").find("div").andSelf().show();
        });

        $(self.shadowRoot).find(".auto-complete-input").focus(function(event) {
            $(this).val("");
            $(self.shadowRoot).find(".checkbox-div").find("div").show();
        });
    }

    var proto = Object.create(HTMLElement.prototype);

    // public
    proto.createdCallback = function() {
        // private members
        var _id, _header, _universe, _filterList, _visibleElements;

        // public members (instance only)
        // defining a read-only property named id with default-value set.
        Object.defineProperty(this, 'num', {
            value: nextId++,
            writable: false,
            enumerable: true
        });

        Object.defineProperty(this, "header", {
            get : function() {return _header},
            set : function(headerLabel) { _header = headerLabel; _setHeader(this)},
            writeable: true,
            enumerable: true
        });

        Object.defineProperty(this, "universe", {
            get : function() {return _universe},
            set : function(universe) { _universe = universe; _setUniverse(this)},
            writeable: true,
            enumerable: true
        });

        Object.defineProperty(this, "visibleElements", {
            get : function() {return _visibleElements},
            set : function(visibleElements) { _visibleElements = visibleElements; _setVisibleElements(this)},
            writeable: true,
            enumerable: true
        });

        // private method
        function _setUniverse(self) {
            console.log("Universe is being set for " + self.querySelector("title-holder").innerHTML + " with list : " + self.universe);

            var listElements = self.universe;
            for(var i in listElements) {
                var tmpDiv = document.createElement("div");
                tmpDiv.style.display = "block";
                tmpDiv.style.marginLeft = "80px";
                var tmpCheck = document.createElement("input");
                tmpCheck.setAttribute("type", "checkbox");

                tmpCheck.addEventListener("change", function() {
                    _fireFilterListChangedEvent(self, this.checked, this.parentElement.innerText);
                });
                tmpDiv.appendChild(tmpCheck);
                tmpDiv.appendChild(document.createTextNode(listElements[i]));
                self.shadowRoot.querySelector(".checkbox-div").appendChild(tmpDiv);
            }
        }

        function _fireFilterListChangedEvent(self, checkboxState, checkboxText) {
            if(!_filterList) {
                _filterList = [];
            }
            var index = _filterList.indexOf(checkboxText);
            if(checkboxState) {
                if(index == -1) {
                    _filterList.push(checkboxText);
                }
            }
            else {
                if(index > -1) {
                    _filterList.splice(index, 1);
                }
            }

            var event =  new CustomEvent('filterListChanged', {'detail' : _filterList});
            self.dispatchEvent(event);
        }

        _initialize(this);

        // locking this object to make sure no memers are added / removed. Members are still writeable.
        Object.seal(this);
    };

    var CustomFilterElement = document.registerElement("custom-filter",{
          prototype : proto
    });

    // freezing the prototype so that one can't add / remove methods through prototype.
    // This has to be done after element registration
    Object.freeze(proto);

    // public static. One can access with classname itslef
    CustomFilterElement.getNextId = function () {
        return nextId;
    };

    return CustomFilterElement;
})();

const TitleHolder = (function() {
    var TitleHolderElement = document.registerElement("title-holder",{
          prototype : Object.create(HTMLLabelElement.prototype),
          extends : "label"
    });
    return TitleHolderElement;
})();