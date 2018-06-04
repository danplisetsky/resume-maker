import createElement from "./createElement";
import attachActionContainer from "./attachActionContainer";
import parseTextToLink from "./parseTextToLink";

const createLinkElement = ({ link, className }) => {
  return createElement(
    "a",
    Object.assign(
      {},
      {
        className: `${className} deleteSelf`,
        innerText: link,
        behaviors: new Map([[attachActionContainer, ["removeLink", "delete"]]])
      },
      parseTextToLink({
        link
      })
    )
  );
};

export default createLinkElement;
