const setupClipboard = buttonId => {
  const clipboard = new ClipboardJS(`#${buttonId}`);
  clipboard.on("success", ev => {
    ev.clearSelection();
  });

  clipboard.on("error", ev => {
    console.log("something went wrong with link copying:");
    console.log(ev);
  });
};

export default setupClipboard;
