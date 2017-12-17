HTMLElement.prototype.insertAfter = function insertAfter(newElement) {
    this.parentNode.insertBefore(newElement, this.nextSibling);
};

HTMLElement.prototype.removeAllChildren = function removeAllChildren() {
    while (this.hasChildNodes())
        this.removeChild(this.lastChild);
};

MouseEvent.prototype.getClientXY = function getClientXY() {
    return [this.clientX, this.clientY];
};

export { insertAfter, getClientXY, removeAllChildren };