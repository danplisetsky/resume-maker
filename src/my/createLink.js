import createLinkElement from "./createLinkElement";
import createDescriptionLinkElement from "./createDescriptionLinkElement";

const createLink = el => {
  el.nextElementSibling.remove(); //removes action container

  const classList = el.classList;
  switch (true) {
    //TODO: add separate function tpo create description link element due to how popup menu works for them

    //TODO: git clean to remove .DS_STORE

    //TODO: refactor to procedure that returns link, then replace child once

    case classList.contains("descriptionElement"): {
      const link = createDescriptionLinkElement({
        description: el.firstChild.innerText,
        link: el.lastChild.innerText
      });
      el.parentNode.replaceChild(link, el);
      break;
    }

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
