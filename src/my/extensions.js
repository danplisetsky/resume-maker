const insertAfter = (referenceElement, newElement) => {
  referenceElement.parentNode.insertBefore(
    newElement,
    referenceElement.nextElementSibling
  );
};

const removeAllChildren = el => {
  while (el.hasChildNodes()) el.removeChild(el.lastChild);
};

const removeSelfAndNextSibling = el => {
  el.nextElementSibling.remove();
  el.remove();
};

const moveUp = el => {
  el.parentNode.insertBefore(el, el.previousElementSibling);
};

const moveDown = el => {
  insertAfter(el.nextElementSibling, el);
};

const getClientXY = mouseEvent => {
  return [mouseEvent.clientX, mouseEvent.clientY];
};

const rgb2hex = rgb => {
  if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

export {
  insertAfter,
  removeAllChildren,
  removeSelfAndNextSibling,
  moveUp,
  moveDown,
  getClientXY,
  rgb2hex
};
