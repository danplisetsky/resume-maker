import newCV from "./newCV";
import processCV from "./processCV";

const processInput = ({ hash }) => {
  switch (true) {
    case hash.length > 0:
      const h = hash.replace(/^#/, "");
      const decodedBase64 = atob(h);
      const unzip = pako.inflate(decodedBase64, { to: "string" });
      processCV(unzip);
      break;
    case localStorage.getItem("content").length > 0:
      processCV(localStorage.getItem("content"));
      break;
    default:
      newCV();
  }
};

export default processInput;
