import createElement from "./createElement";
import attachActionContainer from "./attachActionContainer";
import attachEditBehavior from "./attachEditBehavior";
import parseTextToLink from "./parseTextToLink";

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
      createElement(
        "a",
        Object.assign(
          {},
          {
            className: "linkDescription",
            innerText: link
          },
          parseTextToLink({
            link,
            description
          })
        )
      )
    ]
  });
};

export default createDescriptionLinkElement;
