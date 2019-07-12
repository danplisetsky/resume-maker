import domToJSON from "./domToJSON";

const shareCV = _ => {
  const jsonOutput = domToJSON("CV");
  const zip = pako.deflate(jsonOutput, { to: "string" });
  const base64 = btoa(zip);
  const hash = sha1(base64);

  saveCV(base64, hash)
    .then(() => {
      const link = window.location.host + window.location.pathname + "#" + hash;
      clipboard.writeText(link);
      swal({
        title: "Link created! (and copied to clipboard)",
        icon: "success",
        text: link
      });
    })
    .catch(e => {
      swal(
        "Oops!",
        "The remote island in the Pacific we use to store the CVs appears to be down (Let's hope it's not completely sumberged). Maybe try again a bit later?",
        "error"
      );
      console.error(e);
    });
};

const saveCV = (base64, hash) => {
  return fetch("https://kvdb.io/BpgRTgqZc46butEFssnwP3/" + hash, {
    method: "POST",
    body: JSON.stringify(base64)
  });
};

export default shareCV;
