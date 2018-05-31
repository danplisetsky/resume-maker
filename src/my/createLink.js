import createLinkElement from "./createLinkElement";
import createDescriptionLinkElement from "./createDescriptionLinkElement";

const createLink = el => {
  const classList = el.classList;
  switch (true) {
    case classList.contains("descriptionElement"):
      const descriptionLink = createDescriptionLinkElement({
        description: el.firstChild.innerText,
        link: el.lastChild.innerText
      });
      el.parentNode.replaceChild(descriptionLink, el);
      break;
    default:
      console.log(el);
      const link = createLinkElement(el);
      console.log(link);
      el.parentNode.replaceChild(link, el);
      break;
  }
  // remove actionContainer
};

export default createLink;
