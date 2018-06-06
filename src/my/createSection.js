import createElement from "./createElement";
import attachEditBehavior from "./attachEditBehavior";
import attachActionContainer from "./attachActionContainer";
import attachColorPickerBehavior from "./attachColorPickerBehavior";

const createSection = (
  { columnid, name = "section", nameColor = null } = {},
  children = []
) => {
  const defaultBehaviors = new Map([
    [attachEditBehavior, ""],
    [attachColorPickerBehavior, ""]
  ]);

  return createElement("div", {
    className: "section",
    children: [
      createElement("h3", {
        className: "nameOfSection canPickColor  deleteParentIfNotLast",
        innerText: name,
        style: {
          color: nameColor
        },
        behaviors:
          columnid === "fstColumn"
            ? new Map([
                ...defaultBehaviors.entries(),
                [
                  attachActionContainer,
                  ["addText", "addDescription", "addList", "addAfter", "delete"]
                ]
              ])
            : new Map([
                ...defaultBehaviors.entries(),
                [
                  attachActionContainer,
                  ["addCompoundItem", "addDateItem", "addAfter", "delete"]
                ]
              ])
      }),
      ...children
    ]
  });
};

export default createSection;
