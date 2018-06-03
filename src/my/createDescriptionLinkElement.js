import createElement from "./createElement";
import attachActionContainer from "./attachActionContainer";
import attachEditBehavior from "./attachEditBehavior";

const createDescriptionLinkElement = ({
  description = "description",
  link
}) => {
  return createElement("div", {
    className: "descriptionLinkElement deleteSelf",
    behaviors: new Map([[attachActionContainer, ["removeLink", "delete"]]]),
    children: [
      createElement("p", {
        className: "description canEdit",
        innerText: description,
        behaviors: new Map([[attachEditBehavior, ""]])
      }),
      createElement("a", {
        className: "linkDescription",
        href: `http://${link}`,
        innerText: link
      })
    ]
  });
};

export default createDescriptionLinkElement;
