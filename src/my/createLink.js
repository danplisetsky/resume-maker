import createTextLinkElement from "./createTextLinkElement";
import createDescriptionLinkElement from "./createDescriptionLinkElement";

const createLink = el => {
  el.nextElementSibling.remove(); //remove action container
  const classList = el.classList;
  switch (true) {
    /*  case classList.contains("descriptionElement"):
      const descriptionLink = createDescriptionLinkElement({
        description: el.firstChild.innerText,
        link: el.lastChild.innerText
      });
      el.parentNode.replaceChild(descriptionLink, el);
      break; */
    case classList.contains("textElement"):
      const link = createTextLinkElement({ link: el.innerText });
      el.parentNode.replaceChild(link, el);
      break;
  }
};

export default createLink;
