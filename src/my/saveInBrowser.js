import domToJSON from "./domToJSON";

const saveAndShowAlert = ({ jsonOutput }) => {
  localStorage.setItem("content", jsonOutput);
  swal({
    title: "Saved",
    text: "Your CV has been saved!",
    icon: "success",
    button: false,
    timer: 3000
  });
};

const saveInBrowser = () => {
  const jsonOutput = domToJSON("CV");
  if (localStorage.getItem("content")) {
    swal({
      title: "Confirm Overwriting",
      text: "Are you sure you want to overwrite the CV you've saved before?",
      dangerMode: true,
      buttons: true,
      icon: "warning",
      closeOnClickOutside: false,
      closeOnEsc: false
    }).then(val => {
      if (val) saveAndShowAlert({ jsonOutput });
    });
  } else {
    saveAndShowAlert({ jsonOutput });
  }
};

export default saveInBrowser;
