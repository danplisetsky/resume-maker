import createTextElement from "./createTextElement";
import createDescriptionElement from "./createDescriptionElement";

const removeLink = el => {
  el.nextElementSibling.remove(); //removes action container
  const classList = el.classList;
  switch (true) {
    case classList.contains("textLinkElement"):
      const textElement = createTextElement({
        text: el.innerText
      });
      el.parentNode.replaceChild(textElement, el);
      break;

    /* case classList.contains("descriptionLinkElement"):
      const descriptionElement = createDescriptionElement({
        description: el.firstChild.innerText,
        text: el.lastChild.innerText
      });
      el.parentNode.replaceChild(descriptionElement, el);
      break; */

    case classList.contains("additionalInfoLinkItem"):
      const additionalInfoElement = createTextElement({
        text: el.innerText,
        className: "compoundItemAdditionalInfo"
      });
      el.parentNode.replaceChild(additionalInfoElement, el);
      break;
  }
};

export default removeLink;
