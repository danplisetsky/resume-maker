import newCV from "./newCV";
import processCV from "./processCV";

const processHash = hash => {
  if (hash) {
    const h = hash.replace(/^#/, "");
    const decodedBase64 = atob(h);
    const unzip = pako.inflate(decodedBase64, { to: "string" });
    processCV(unzip);
  } else {
    newCV();
  }
};

export default processHash;
