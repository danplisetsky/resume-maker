import createHeader from "./createHeader";
import createGrid from "./createGrid";
import randomName from "./randomName";
import createNewCV from "./createNewCV";

const newCV = () => {
  history.replaceState("", document.title, window.location.pathname);
  createNewCV("CV", createHeader(), createGrid());
};

export default newCV;
