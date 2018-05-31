import createElement from "./createElement";
import attachActionContainer from "./attachActionContainer";

const createLinkElement = el => {
  return createElement("a", {
    // className: "linkElement deleteSelf",
    href: `http://${el.innerText}`,
    innerText: el.innerText,
    behaviors: new Map([[attachActionContainer, ["delete" /* remove link */]]])
  });
};

export default createLinkElement;
