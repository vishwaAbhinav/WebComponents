const TitleHolder = (function() {
    var TitleHolderElement = document.registerElement("title-holder",{
          prototype : Object.create(HTMLLabelElement.prototype),
          extends : "label"
    });
    return TitleHolderElement;
})();