import createElement from "./createElement";
import attachEditBehavior from "./attachEditBehavior";
import attachActionContainer from "./attachActionContainer";

const createTextElement = ({
  text = "text",
  className = "textElement",
  style = {}
} = {}) => {
  return createElement("p", {
    className: `${className} canEdit deleteSelf`,
    innerText: text,
    style: style,
    behaviors: new Map([
      [attachEditBehavior, ""],
      [
        attachActionContainer,
        className === "compoundItemDescription"
          ? ["delete"]
          : ["addStrikethrough", "addLink", "delete"]
      ]
    ])
  });
};

export default createTextElement;
