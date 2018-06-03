import createLinkElement from "./createLinkElement";
import createDescriptionLinkElement from "./createDescriptionLinkElement";

const createLink = el => {
  const classList = el.classList;

  switch (true) {
    case classList.contains("textElement"):
      return createLinkElement({
        link: el.innerText,
        className: "textLinkElement"
      });

    case classList.contains("descriptionElement"):
      return createDescriptionLinkElement({
        description: el.firstChild.innerText,
        link: el.lastChild.innerText
      });

    case classList.contains("compoundItemAdditionalInfo"):
      return createLinkElement({
        link: el.innerText,
        className: "additionalInfoLinkItem"
      });
  }
};

export default createLink;
