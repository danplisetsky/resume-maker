HTMLElement.prototype.insertAfter = function insertAfter(newElement) {
    this.parentNode.insertBefore(newElement, this.nextSibling);
};

MouseEvent.prototype.getClientXY = function getClientXY() {
    return [this.clientX, this.clientY];
};

export { insertAfter, getClientXY };