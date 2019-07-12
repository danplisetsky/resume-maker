import newCV from "./newCV";
import processCV from "./processCV";

const processInput = ({ hash }) => {
  switch (true) {
    case hash.length > 0:
      const h = hash.replace(/^#/, "");
      retrieveCV(h)
        .then(base64 => {
          const decodedBase64 = atob(base64);
          const unzip = pako.inflate(decodedBase64, { to: "string" });
          processCV(unzip);
        })
        .catch(e => {
          swal(
            "Oops!",
            "The remote island in the Pacific we use to store the CVs appears to be down (Let's hope it's not completely sumberged). Maybe try again a bit later?",
            "error"
          );
          console.error(e);
          newCV();
        });
      break;
    case localStorage.getItem("content") &&
      localStorage.getItem("content").length > 0:
      processCV(localStorage.getItem("content"));
      break;
    default:
      newCV();
  }
};

const retrieveCV = key => {
  return fetch("https://kvdb.io/BpgRTgqZc46butEFssnwP3/" + key).then(data =>
    data.json()
  );
};

export default processInput;
