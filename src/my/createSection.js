import createElement from "./createElement";
import attachEditBehavior from "./attachEditBehavior";
import attachActionContainer from "./attachActionContainer";
import attachColorPickerBehavior from "./attachColorPickerBehavior";
import attachDragAndDropBehavior from "./attachDragAndDropBehavior";

const createSection = (
  { columnid, name = "section", nameColor = null, draggable = true } = {},
  children = []
) => {
  const defaultBehaviors = new Map([
    [attachEditBehavior, ""],
    [attachColorPickerBehavior, ""]
  ]);

  return createElement("div", {
    className: "section",
    draggable: draggable,
    behaviors: new Map([[attachDragAndDropBehavior, ""]]),

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
