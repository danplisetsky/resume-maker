import createElement from "./createElement";
import attachActionContainer from "./attachActionContainer";

const createTextLinkElement = ({ link }) => {
  return createElement("a", {
    className: "textLinkElement deleteSelf",
    href: `http://${link}`,
    innerText: link,
    behaviors: new Map([[attachActionContainer, ["removeLink", "delete"]]])
  });
};

export default createTextLinkElement;
