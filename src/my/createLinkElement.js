import createElement from "./createElement";
import attachActionContainer from "./attachActionContainer";

const createLinkElement = ({ link, className }) => {
  return createElement("a", {
    className: `${className} deleteSelf`,
    href: `http://${link}`,
    innerText: link,
    behaviors: new Map([[attachActionContainer, ["removeLink", "delete"]]])
  });
};

export default createLinkElement;
