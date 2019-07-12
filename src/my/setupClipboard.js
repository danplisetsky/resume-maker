const setupClipboard = buttonId => {
  const clipboard = new ClipboardJS(`#${buttonId}`);
  clipboard.on("success", ev => {
    ev.clearSelection();
    swal({
      title: "Link created! (and copied to clipboard)",
      icon: "success",
      text: ev.text
    });
  });

  clipboard.on("error", ev => {
    swal("Oops!", "Something went wrong!", "error");
    console.log("something went wrong with link copying:");
    console.log(ev);
  });
};

export default setupClipboard;
