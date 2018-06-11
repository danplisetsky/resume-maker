import attachButtonBehavior from "./my/attachButtonBehavior";
import newCV from "./my/newCV";
import saveCV from "./my/saveCV";
import loadCV from "./my/loadCV";
import templateCV from "./my/templateCV";
import print from "./my/print";
import shareCV from "./my/shareCV";
import setupClipboard from "./my/setupClipboard";
import processHash from "./my/processHash";

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
    },
    {
      id: "shareCVButton",
      callback: shareCV
    }
  ];

  buttonsAndBehaviors.forEach(bab => attachButtonBehavior(bab));

  setupClipboard("shareCVButton");
  processHash(window.location.hash);
};

window.onbeforeunload = ev => {
  const msg = "Please don't go without saving your work… ";
  ev.returnValue = msg;
  return msg;
};
