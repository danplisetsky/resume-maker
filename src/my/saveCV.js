import domToJSON from "./domToJSON";

const saveCV = () => {
  const jsonOutput = domToJSON("CV");

  const name = document.getElementById("name").innerText + ".cv";
  const blob = new Blob([jsonOutput], {
    type: "text/plain;charset=utf-8"
  });
  saveAs(blob, name);
};

export default saveCV;
