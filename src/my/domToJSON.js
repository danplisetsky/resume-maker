const domToJSON = cvId => {
  const CV = document.getElementById(cvId);

  return domJSON.toJSON(CV, {
    attributes: [false, "id", "class", "style"],
    domProperties: [false, "alt"],
    stringify: true
  });
};

export default domToJSON;
