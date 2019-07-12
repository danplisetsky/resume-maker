import attachButtonBehavior from "./my/attachButtonBehavior";
import newCV from "./my/newCV";
import saveCV from "./my/saveCV";
import loadCV from "./my/loadCV";
import templateCV from "./my/templateCV";
import print from "./my/print";
import shareCV from "./my/shareCV";
import processInput from "./my/processInput";
import saveInBrowser from "./my/saveInBrowser";
import showHelp from "./my/showHelp";

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
    },
    {
      id: "saveInBrowser",
      callback: saveInBrowser
    },
    {
      id: "helpButton",
      callback: showHelp
    }
  ];

  buttonsAndBehaviors.forEach(bab => attachButtonBehavior(bab));

  processInput({ hash: window.location.hash });
};

window.onbeforeunload = ev => {
  const msg = "Please don't go without saving your work… ";
  ev.returnValue = msg;
  return msg;
};
