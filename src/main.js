import attachButtonBehavior from "./my/attachButtonBehavior";
import newCV from "./my/newCV";
import saveCV from "./my/saveCV";
import loadCV from "./my/loadCV";
import templateCV from "./my/templateCV";
import print from "./my/print";

window.onload = () => {
  const buttonsAndBehaviors = [
    {
      id: "newCVButton",
      callback: newCV
    },
    {
      id: "saveCVButton",
      callback: saveCV
    },
    {
      id: "loadCVButton",
      callback: loadCV
    },
    {
      id: "templateCVButton",
      callback: templateCV
    },
    {
      id: "printButton",
      callback: print
    }
  ];

  buttonsAndBehaviors.forEach(bab => attachButtonBehavior(bab));

  newCV();
};

window.onbeforeunload = ev => {
  const msg = "Please don't go without saving your work… ";
  ev.returnValue = msg;
  return msg;
};
