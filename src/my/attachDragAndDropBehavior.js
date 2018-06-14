const attachDragAndDropBehavior = el => {
  el.ondragstart = ev => {
    console.log(ev);
  };
};

export default attachDragAndDropBehavior;
