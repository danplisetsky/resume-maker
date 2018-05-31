import createTextElement from "./createTextElement";

const removeLink = el => {
  el.nextElementSibling.remove(); //remove action container
  const classList = el.classList;
  switch (true) {
    case classList.contains("textLinkElement"):
      const textElement = createTextElement({ text: el.innerText });
      el.parentNode.replaceChild(textElement, el);
  }
};

export default removeLink;
