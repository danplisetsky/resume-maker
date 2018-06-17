import { bodyHtml } from "../../dist/README.json";

const parseHtml = htmlString => {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div;
};

const getInstructionsFromReadme = htmlString => {
  const regex = /<h2>How to use<\/h2>(.+)<h2>/;
  const instructions = regex.exec(htmlString)[1];
  return parseHtml(instructions);
};

const showHelp = () => {
  swal({
    title: "How to Use",
    icon: "info",
    button: true,
    content: getInstructionsFromReadme(bodyHtml.replace(/\n/g, "")),
    className: "swal-help"
  });
};

export default showHelp;
