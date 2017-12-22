HTMLElement.prototype.insertAfter = function insertAfter(newElement) {
    this.parentNode.insertBefore(newElement, this.nextSibling);
};

HTMLElement.prototype.removeAllChildren = function removeAllChildren() {
    while (this.hasChildNodes())
        this.removeChild(this.lastChild);
};

HTMLElement.prototype.removeSelfAndNextSibling = function removeSelfAndNextSibling() {
    this.nextElementSibling.remove();
    this.remove();
};

MouseEvent.prototype.getClientXY = function getClientXY() {
    return [this.clientX, this.clientY];
};

export { insertAfter, getClientXY, removeAllChildren, removeSelfAndNextSibling };