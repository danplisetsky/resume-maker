import createLinkElement from "./createLinkElement";

const createLink = el => {
  el.nextElementSibling.remove(); //removes action container

  const classList = el.classList;
  switch (true) {
    /* case classList.contains("descriptionElement"): {
      const link = createLinkElement({
        link: el.lastChild.innerText,
        className: "descriptionLinkElement"
      });
      el.replaceChild(link, el.lastChild);
      break;
    } */

    case classList.contains("textElement"): {
      const link = createLinkElement({
        link: el.innerText,
        className: "textLinkElement"
      });
      el.parentNode.replaceChild(link, el);
      break;
    }

    case classList.contains("compoundItemAdditionalInfo"): {
      const link = createLinkElement({
        link: el.innerText,
        className: "additionalInfoLinkItem"
      });
      el.parentNode.replaceChild(link, el);
      break;
    }
  }
};

export default createLink;
