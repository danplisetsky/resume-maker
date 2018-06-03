import createTextElement from "./createTextElement";
import createDescriptionElement from "./createDescriptionElement";

const removeLink = el => {
  const classList = el.classList;

  switch (true) {
    case classList.contains("textLinkElement"):
      return createTextElement({ text: el.innerText });

    case classList.contains("descriptionLinkElement"):
      return createDescriptionElement({
        description: el.firstChild.innerText,
        text: el.lastChild.innerText
      });

    case classList.contains("additionalInfoLinkItem"):
      return createTextElement({
        text: el.innerText,
        className: "compoundItemAdditionalInfo"
      });
  }
};

export default removeLink;
