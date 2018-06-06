import createElement from "./createElement";
import attachEditBehavior from "./attachEditBehavior";
import randomName from "./randomName";
import attachColorPickerBehavior from "./attachColorPickerBehavior";

const createSubheader = ({ tag, id, name, color }) => {
  return createElement(tag, {
    id: id,
    className: "canPickColor canEdit",
    innerText: name,
    style: {
      color: color
    },
    behaviors: new Map([
      [attachColorPickerBehavior, ""],
      [attachEditBehavior, ""]
    ])
  });
};

const createHeader = (
  header = {
    backgroundColor: null
  },
  name = {
    tag: "h1",
    id: "name",
    name: randomName(),
    color: null
  },
  occupation = {
    tag: "h2",
    id: "occupation",
    name: "software developer",
    color: null
  }
) => {
  const headerElement = createElement("div", {
    id: "header",
    className: "canPickBackgroundColor",
    style: {
      backgroundColor: header.backgroundColor
    },
    behaviors: new Map([[attachColorPickerBehavior, "backgroundColor"]]),
    children: [createSubheader(name), createSubheader(occupation)]
  });

  return headerElement;
};

export default createHeader;
