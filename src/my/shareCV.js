import domToJSON from "./domToJSON";

const shareCV = _ => {
  const jsonOutput = domToJSON("CV");

  const zip = pako.deflate(jsonOutput, { to: "string" });
  const base64 = btoa(zip);
  window.location.hash = base64;
  document.getElementById("hashInput").value = window.location.href;
};

export default shareCV;
