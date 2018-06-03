const changeLink = ({ el, newElemFunc }) => {
  console.log(newElemFunc);

  el.nextElementSibling.remove(); //removes action container

  const newElem = newElemFunc(el);

  el.parentNode.replaceChild(newElem, el);
};

export default changeLink;
