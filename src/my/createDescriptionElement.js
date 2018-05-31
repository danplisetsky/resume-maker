import createElement from "./createElement";
import attachActionContainer from "./attachActionContainer";
import attachEditBehavior from "./attachEditBehavior";

const createDescriptionElement = ({
  description = "description",
  text = "text"
} = {}) => {
  return createElement("div", {
    className: "descriptionElement deleteSelf",
    behaviors: new Map([[attachActionContainer, ["addLink", "delete"]]]),
    children: [
      createElement("p", {
        className: "description canEdit",
        innerText: description,
        behaviors: new Map([[attachEditBehavior, ""]])
      }),
      createElement("p", {
        className: "descriptionText canEdit",
        innerText: text,
        behaviors: new Map([[attachEditBehavior, ""]])
      })
    ]
  });
};

export default createDescriptionElement;
