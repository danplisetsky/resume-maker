const createElement = (tag, attributes) => {
  const elem = document.createElement(tag);
  for (const attr in attributes) {
    switch (attr) {
      case "style":
        for (const rule in attributes.style)
          elem.style[rule] = attributes.style[rule];
        break;
      case "children":
        for (const item of attributes.children) elem.appendChild(item);
        break;
      case "behaviors":
        for (const [func, args] of attributes.behaviors)
          func(elem, args || undefined);
        break;
      default:
        elem[attr] = attributes[attr];
        break;
    }
  }
  return elem;
};

export default createElement;
