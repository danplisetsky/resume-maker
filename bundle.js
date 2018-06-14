(function () {
  'use strict';

  const attachButtonBehavior = ({ id, callback }) => {
    const button = document.getElementById(id);
    if (button.tagName === "INPUT" && button.type === "file")
      button.onchange = callback;
    else button.onclick = callback;
  };

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

  const forEachElem = selector => {
      return (action, ...args) => {
          const els = [...document.querySelectorAll(selector)];
          els.forEach(el => action(el, args));
      }
  };

  const insertAfter = (referenceElement, newElement) => {
    referenceElement.parentNode.insertBefore(
      newElement,
      referenceElement.nextElementSibling
    );
  };

  const removeAllChildren = el => {
    while (el.hasChildNodes()) el.removeChild(el.lastChild);
  };

  const removeSelfAndNextSibling = el => {
    el.nextElementSibling.remove();
    el.remove();
  };

  const moveUp = el => {
    el.parentNode.insertBefore(el, el.previousElementSibling);
  };

  const moveDown = el => {
    insertAfter(el.nextElementSibling, el);
  };

  const getClientXY = mouseEvent => {
    return [mouseEvent.clientX, mouseEvent.clientY];
  };

  const rgb2hex = rgb => {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  };

  const attachEditBehavior = el => {

      const createInput = () => {
          const elStyle = getComputedStyle(el);
          const prevDisplay = el.style.display;

          const input = createElement('input', {
              type: 'text',
              value: el.innerText,
              style: {
                  fontSize: elStyle.fontSize,
                  fontWeight: elStyle.fontWeight
              },
              onkeydown: ev => {
                  if (ev.code === 'Enter' || ev.code === 'NumpadEnter') {
                      if (!input.value)
                          alert("can't be empty!");
                      else {
                          el.innerText = input.value;
                          el.style.display = prevDisplay;
                          input.parentNode.remove();
                          forEachElem('.actionContainer')(ac => ac.remove());
                      }
                  }
              }
          });

          return createElement('div', {
              className: 'input',
              children: [input]
          });
      };

      el.addEventListener('dblclick', ev => {
          const input = createInput();
          insertAfter(el, input);
          input.firstChild.focus();
          el.style.display = 'none';
          ev.stopPropagation();
          forEachElem('.actionContainer')(ac => ac.remove());
      });
  };

  const randomName = () => {
      return Math.random() < 0.5
          ? 'John Doe'
          : 'Jane Doe';
  };

  const attachColorPickerBehavior = (el, styleColor = "color") => {
    el.onclick = ev => {
      ev.stopPropagation();
      if (ev.target === el) {
        const colorPicker = document.getElementById("colorPicker");

        colorPicker.value =
          rgb2hex(getComputedStyle(el)[styleColor]) || "#000000";
        colorPicker.select();

        colorPicker.oninput = _ => (el.style[styleColor] = colorPicker.value);
      }
    };
  };

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

  const deleteElementIfNotHoveredOver = (
      elem,
      [
          [clientX, clientY],
          { left = 0, top = 0, right = 0, bottom = 0 }
      ]) => {
      const coord = elem.getBoundingClientRect();
      if (!(coord.left <= clientX + left && clientX - right <= coord.right && coord.top <= clientY + top && clientY - bottom <= coord.bottom))
          elem.remove();
  };

  const DeleteAction = {
      DeleteParent: 1,
      DeleteSelf: 2,
      DeleteSelfAndParentIfLast: 3,
      DeleteParentIfNotLast: 4
  };

  const createTextElement = ({
    text = "text",
    className = "textElement"
  } = {}) => {
    return createElement("p", {
      className: `${className} canEdit deleteSelf`,
      innerText: text,
      behaviors: new Map([
        [attachEditBehavior, ""],
        [
          attachActionContainer,
          className == "compoundItemDescription"
            ? ["delete"]
            : ["addLink", "delete"]
        ]
      ])
    });
  };

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

  const createListElement = (
      {
          description = 'description'
      } = {},
      children = [
          createTextElement()
      ]) => {
      return createElement('div', {
          className: 'listElement',
          children: [
              createElement('p', {
                  className: 'description canEdit deleteParent',
                  innerText: description,
                  behaviors: new Map([
                      [attachEditBehavior, ''],
                      [attachActionContainer,
                          ['addText', 'delete']]
                  ])
              }),
              ...children
          ]
      });
  };

  const createDetailElement = (
      {
          text = 'detail'
      } = {}) => {
      return createElement('li', {
          className: 'detailElement canEdit deleteSelfAndParentIfLast',
          innerText: text,
          behaviors: new Map([
              [attachEditBehavior, ''],
              [attachActionContainer,
                  ['addDetail', 'delete']]
          ])
      })
  };

  const createDetailsElement = (children = [
      createDetailElement()
  ]) => {
      return createElement('ul', {
          className: 'compoundItemDetails',
          children: children
      })
  };

  const createCompoundItem = (
      {
          name = 'name',
      } = {},
      children = [
          createTextElement({
              text: 'description',
              className: 'compoundItemDescription'
          }),
          createTextElement({
              text: 'additional info',
              className: 'compoundItemAdditionalInfo'
          }),
          createDetailsElement()
      ]) => {
      return createElement('div', {
          className: 'compoundItem',
          children: [
              createElement('p', {
                  className: 'compoundItemName canEdit deleteParent',
                  innerText: name,
                  behaviors: new Map([
                      [attachEditBehavior, ''],
                      [attachActionContainer, ['delete']]
                  ])
              }),
              ...children        
          ]
      });
  };

  const createDateItem = (
      {
          date = `01/${new Date().getFullYear()} -- Present`,
          compoundItem = createCompoundItem()
      } = {}) => {
      return createElement('div', {
          className: 'dateItem',
          children: [
              createElement('p', {
                  className: 'date canEdit deleteParent',
                  innerText: date,
                  behaviors: new Map([
                      [attachEditBehavior, ''],
                      [attachActionContainer, ['delete']]
                  ])
              }),
              compoundItem
          ]
      });
  };

  const attachMovingBehavior = el => {
      return fn => {
          el.nextElementSibling.remove(); //remove action container
          if (el.className.includes('deleteParent'))
              fn(el.parentNode);
          else
              fn(el);
      };
  };

  const attachMoveUpBehavior = el => {  
      attachMovingBehavior(el)(moveUp);
  };

  const attachMoveDownBehavior = el => {
      attachMovingBehavior(el)(moveDown);
  };

  const parseTextToLink = ({ link, description = "" }) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const twitterDescriptionRegex = /twitter/i;
    const githubDescriptionRegex = /github/i;

    switch (true) {
      case emailRegEx.test(link):
        return {
          href: `mailto:${link}`
        };
      case link.startsWith("@") || twitterDescriptionRegex.test(description):
        return {
          href: `https://twitter.com/${link.slice(1)}`,
          target: "_blank"
        };
      case githubDescriptionRegex.test(description):
        return {
          href: `https://github.com/${link}`,
          target: "_blank"
        };
      default:
        return {
          href: `http://${link}`,
          target: "_blank"
        };
    }
  };

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

  const createLink = el => {
    const classList = el.classList;

    switch (true) {
      case classList.contains("textElement"):
        return createLinkElement({
          link: el.innerText,
          className: "textLinkElement"
        });

      case classList.contains("descriptionElement"):
        return createDescriptionLinkElement({
          description: el.firstChild.innerText,
          link: el.lastChild.innerText
        });

      case classList.contains("compoundItemAdditionalInfo"):
        return createLinkElement({
          link: el.innerText,
          className: "additionalInfoLinkItem"
        });
    }
  };

  const removeLink = el => {
    const classList = el.classList;

    switch (true) {
      case classList.contains("textLinkElement"):
        return createTextElement({ text: el.innerText });

      case classList.contains("descriptionLinkElement"):
        return createDescriptionElement({
          description: el.firstChild.innerText,
          text: el.lastChild.innerText
        });

      case classList.contains("additionalInfoLinkItem"):
        return createTextElement({
          text: el.innerText,
          className: "compoundItemAdditionalInfo"
        });
    }
  };

  const changeLink = ({ el, newElemFunc }) => {
    el.nextElementSibling.remove(); //removes action container

    const newElem = newElemFunc(el);

    el.parentNode.replaceChild(newElem, el);
  };

  const createDeleteBehavior = el => {
    const mapDeleteAction = name => {
      switch (name) {
        case "deleteParent":
          return DeleteAction.DeleteParent;
        case "deleteSelf":
          return DeleteAction.DeleteSelf;
        case "deleteSelfAndParentIfLast":
          return DeleteAction.DeleteSelfAndParentIfLast;
        case "deleteParentIfNotLast":
          return DeleteAction.DeleteParentIfNotLast;
        default:
          throw "wrong delete class";
      }
    };

    const deleteAction = [...el.classList.values()]
      .filter(cl => cl.startsWith("delete"))
      .map(mapDeleteAction)[0];

    switch (deleteAction) {
      case DeleteAction.DeleteParent:
        el.parentNode.remove();
        break;
      case DeleteAction.DeleteSelf:
        removeSelfAndNextSibling(el); //also removes actionContainer
        break;
      case DeleteAction.DeleteSelfAndParentIfLast:
        if (el.parentNode.querySelectorAll(el.tagName).length === 1)
          el.parentNode.remove();
        else removeSelfAndNextSibling(el); //also removes actionContainer
        break;
      case DeleteAction.DeleteParentIfNotLast:
        if (
          el.parentNode.parentNode.querySelectorAll(`.${el.parentNode.className}`)
            .length === 1
        )
          alert("Can't delete the last remaining section!");
        else el.parentNode.remove();
        break;
    }
  };

  const createAction = (el, actionName) => {
    /* switch on function name */
    switch (actionName.name) {
      case "createDeleteBehavior":
        return () => createDeleteBehavior(el);
      case "createSection":
        return () =>
          insertAfter(
            el.parentNode,
            createSection({
              columnid: el.parentNode.parentNode.id
            })
          );
      case "createDetailElement":
        return () => insertAfter(el, createDetailElement());
      case "attachMoveUpBehavior":
      case "attachMoveDownBehavior":
        return () => actionName(el);
      case "createLink":
        return () =>
          changeLink({
            el,
            newElemFunc: createLink
          });
      case "removeLink":
        return () =>
          changeLink({
            el,
            newElemFunc: removeLink
          });
      default:
        return () => insertAfter(el.parentNode.lastChild, actionName());
    }
  };

  const createActionIcons = (el, icons) => {
    const createIcon = ([name, actionName]) => {
      return createElement("div", {
        className: `actionIcon ${name}`,
        onclick: createAction(el, actionName)
      });
    };

    /* order of elements in this map determines in which order
    they show up in the popup menu */
    const actionIcons = new Map([
      ["addText", createTextElement],
      ["addDescription", createDescriptionElement],
      ["addList", createListElement],
      ["addCompoundItem", createCompoundItem],
      ["addDateItem", createDateItem],
      ["addDetail", createDetailElement],
      ["addAfter", createSection],
      ["addLink", createLink],
      ["removeLink", removeLink],
      ["moveUp", attachMoveUpBehavior],
      ["moveDown", attachMoveDownBehavior],
      ["delete", createDeleteBehavior]
    ]);

    return [...actionIcons]
      .filter(([key]) => icons.includes(key))
      .map(item => createIcon(item));
  };

  const attachActionContainer = (el, icons) => {
    const addMoveUp = el => {
      return el.className.includes("deleteParent")
        ? addMoveUp(el.parentNode)
        : !el.previousElementSibling ||
          el.previousElementSibling.className.includes("deleteParent") ||
          el.parentNode.classList.contains("compoundItem")
          ? ""
          : "moveUp";
    };

    const addMoveDown = el => {
      return el.className.includes("deleteParent")
        ? addMoveDown(el.parentNode)
        : !el.nextElementSibling ||
          el.parentNode.classList.contains("compoundItem")
          ? ""
          : "moveDown";
    };

    const createActionContainer = (left, top) => {
      const actionContainer = createElement("div", {
        className: "actionContainer",
        style: {
          left: `${left + 3}px`,
          top: `${top - 3}px`
        },
        children: createActionIcons(el, [
          ...icons,
          addMoveUp(el),
          addMoveDown(el)
        ]),
        onmouseleave: ev => actionContainer.remove()
      });

      return actionContainer;
    };

    el.addEventListener("mouseover", ev =>
      insertAfter(
        el,
        createActionContainer(
          ev.currentTarget.offsetLeft + ev.currentTarget.offsetWidth,
          ev.target.offsetTop
        )
      )
    );

    el.addEventListener("mouseleave", ev =>
      forEachElem(".actionContainer")(
        deleteElementIfNotHoveredOver,
        getClientXY(ev),
        { left: 5 }
      )
    );
  };

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

  const createGrid = (
    fstColumn = {
      id: "fstColumn",
      children: [[{ name: "contact", color: null }]]
    },
    sndColumn = {
      id: "sndColumn",
      children: [[{ name: "experience", color: null }]]
    }
  ) => {
    const makeCreateSection = (id, [fst, ...rest]) => {
      const addToArgsMeta = (argsMeta, obj) => Object.assign(argsMeta, obj);

      const processTextLinkElement = ([fstChild]) => {
        return createLinkElement({
          link: fstChild.textContent,
          className: "textLinkElement"
        });
      };

      const processTextElement = ([fstChild]) => {
        return createTextElement({
          text: fstChild.textContent
        });
      };

      const processDescriptionElement = ([fstChild, ...rest], argsMeta = {}) => {
        return !fstChild
          ? createDescriptionElement(argsMeta)
          : fstChild.classList.contains("description")
            ? processDescriptionElement(
                rest,
                addToArgsMeta(argsMeta, {
                  description: fstChild.innerText
                })
              )
            : fstChild.classList.contains("descriptionText")
              ? processDescriptionElement(
                  rest,
                  addToArgsMeta(argsMeta, {
                    text: fstChild.innerText
                  })
                )
              : processDescriptionElement(rest, argsMeta);
      };

      const processDescriptionLinkElement = (
        [fstChild, ...rest],
        argsMeta = {}
      ) => {
        return !fstChild
          ? createDescriptionLinkElement(argsMeta)
          : fstChild.classList.contains("description")
            ? processDescriptionLinkElement(
                rest,
                addToArgsMeta(argsMeta, {
                  description: fstChild.innerText
                })
              )
            : fstChild.classList.contains("linkDescription")
              ? processDescriptionLinkElement(
                  rest,
                  addToArgsMeta(argsMeta, {
                    link: fstChild.innerText
                  })
                )
              : processDescriptionLinkElement(rest, argsMeta);
      };

      const processListElement = (
        [fstChild, ...rest],
        [argsMeta = {}, ...argsChildren] = []
      ) => {
        return !fstChild
          ? createListElement(argsMeta, argsChildren)
          : fstChild.classList.contains("description")
            ? processListElement(rest, [
                addToArgsMeta(argsMeta, {
                  description: fstChild.innerText
                })
              ])
            : fstChild.classList.contains("textElement")
              ? processListElement(rest, [
                  argsMeta,
                  ...argsChildren,
                  createTextElement({
                    text: fstChild.innerText
                  })
                ])
              : fstChild.classList.contains("textLinkElement")
                ? processListElement(rest, [
                    argsMeta,
                    ...argsChildren,
                    createLinkElement({
                      link: fstChild.textContent,
                      className: "textLinkElement"
                    })
                  ])
                : processListElement(rest, [argsMeta, argsChildren]);
      };

      const processCompoundItem = (
        [fstChild, ...rest],
        [argsMeta = {}, ...argsChildren] = []
      ) => {
        const processDetails = ([fstDetail, ...rest], children = []) => {
          return !fstDetail
            ? createDetailsElement(children)
            : fstDetail.classList.contains("detailElement")
              ? processDetails(
                  rest,
                  children.concat(
                    createDetailElement({
                      text: fstDetail.innerText
                    })
                  )
                )
              : processDetails(rest, children);
        };

        if (!fstChild) return createCompoundItem(argsMeta, argsChildren);
        else {
          const classList = fstChild.classList;
          switch (true) {
            case classList.contains("compoundItemName"):
              return processCompoundItem(rest, [
                addToArgsMeta(argsMeta, {
                  name: fstChild.innerText
                })
              ]);
            case classList.contains("compoundItemDescription"):
              return processCompoundItem(rest, [
                argsMeta,
                ...argsChildren,
                createTextElement({
                  text: fstChild.innerText,
                  className: "compoundItemDescription"
                })
              ]);
            case classList.contains("compoundItemAdditionalInfo"):
              return processCompoundItem(rest, [
                argsMeta,
                ...argsChildren,
                createTextElement({
                  text: fstChild.innerText,
                  className: "compoundItemAdditionalInfo"
                })
              ]);
            case classList.contains("additionalInfoLinkItem"):
              return processCompoundItem(rest, [
                argsMeta,
                ...argsChildren,
                createLinkElement({
                  link: fstChild.textContent,
                  className: "additionalInfoLinkItem"
                })
              ]);
            case classList.contains("compoundItemDetails"):
              return processCompoundItem(rest, [
                argsMeta,
                ...argsChildren,
                processDetails(fstChild.childNodes)
              ]);
            default:
              return processCompoundItem(rest, [argsMeta, ...argsChildren]);
          }
        }
      };

      const processDateItem = ([fstChild, ...rest], argsMeta = {}) => {
        return !fstChild
          ? createDateItem(argsMeta)
          : fstChild.classList.contains("date")
            ? processDateItem(
                rest,
                addToArgsMeta(argsMeta, {
                  date: fstChild.innerText
                })
              )
            : fstChild.classList.contains("compoundItem")
              ? processDateItem(
                  rest,
                  addToArgsMeta(argsMeta, {
                    compoundItem: processCompoundItem(fstChild.childNodes)
                  })
                )
              : processDateItem(rest, argsMeta);
      };

      const processChildren = ([fstElement, ...rest], children = []) => {
        const processChild = fn => {
          return processChildren(
            rest,
            children.concat(fn(fstElement.childNodes))
          );
        };

        if (!fstElement) return children;
        else {
          const classList = fstElement.classList;
          switch (true) {
            case classList.contains("textElement"):
              return processChild(processTextElement);
            case classList.contains("textLinkElement"):
              return processChild(processTextLinkElement);
            case classList.contains("descriptionElement"):
              return processChild(processDescriptionElement);
            case classList.contains("descriptionLinkElement"):
              return processChild(processDescriptionLinkElement);
            case classList.contains("listElement"):
              return processChild(processListElement);
            case classList.contains("compoundItem"):
              return processChild(processCompoundItem);
            case classList.contains("dateItem"):
              return processChild(processDateItem);
            default:
              return processChildren(rest, children);
          }
        }
      };

      return fst.hasOwnProperty("name")
        ? createSection(
            {
              columnid: id,
              name: fst.name,
              nameColor: fst.color
            },
            processChildren(rest)
          )
        : () => {
            throw "wrongly formatted CV file";
          };
    };

    const createColumn = ({ id, children }) => {
      const sections = children.map(section => makeCreateSection(id, section));
      return createElement("div", {
        id: id,
        className: "subgrid",
        children: sections
      });
    };

    return createElement("div", {
      id: "grid",
      children: [createColumn(fstColumn), createColumn(sndColumn)]
    });
  };

  const createNewCV = (id, header, grid) => {
      const loadCVButton = document.getElementById('loadCVButton');
      loadCVButton.value = null;
      
      const CV = document.getElementById(id);
      removeAllChildren(CV);
      CV.appendChild(header);
      CV.appendChild(grid);
  };

  const newCV = () => {
    history.replaceState("", document.title, window.location.pathname);
    createNewCV("CV", createHeader(), createGrid());
  };

  const domToJSON = cvId => {
    const CV = document.getElementById(cvId);

    return domJSON.toJSON(CV, {
      attributes: [false, "id", "class", "style"],
      domProperties: [false, "alt"],
      stringify: true
    });
  };

  const saveCV = () => {
    const jsonOutput = domToJSON("CV");

    const name = document.getElementById("name").innerText + ".cv";
    const blob = new Blob([jsonOutput], {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, name);
  };

  const processHeader = (node, id) => {
    if (!node || !node.childNodes) return;
    else {
      switch (node.id) {
        case "header":
          return createHeader(
            {
              backgroundColor: node.style.backgroundColor
            },
            processHeader(node.firstElementChild, "name"),
            processHeader(node.firstElementChild, "occupation")
          );
        case id:
          return {
            tag: node.tagName,
            id: node.id,
            name: node.innerText,
            color: node.style.color
          };
        default:
          return processHeader(node.nextSibling, id);
      }
    }
  };

  const processGrid = node => {
    const processSection = ([fstElement, ...rest], children = []) => {
      return !fstElement
        ? children
        : fstElement.classList.contains("nameOfSection")
          ? processSection(
              rest,
              children.concat({
                name: fstElement.innerText,
                color: fstElement.style.color
              })
            )
          : processSection(rest, children.concat(fstElement));
    };

    const processSubgrid = ([fstSection, ...rest], children = []) => {
      return !fstSection
        ? children
        : processSubgrid(rest, [
            ...children,
            processSection(fstSection.childNodes)
          ]);
    };

    return !node || !node.childNodes
      ? () => {
          throw "wrongly formatted cv!";
        }
      : node.id === "grid"
        ? createGrid(
            processGrid(node.firstElementChild),
            processGrid(node.lastElementChild)
          )
        : {
            id: node.id,
            children: processSubgrid(node.childNodes)
          };
  };

  const processCV = jsonCV => {
    try {
      const domCV = domJSON.toDOM(jsonCV).firstElementChild;
      const header = processHeader(
        [...domCV.childNodes].find(cn => cn.id === "header")
      );
      const grid = processGrid(
        [...domCV.childNodes].find(cn => cn.id === "grid")
      );

      createNewCV(domCV.id, header, grid);
    } catch (e) {
      if (e instanceof SyntaxError)
        console.log("file is wrongly formatted ", e.message);
      else console.log("unknown error", e.message);

      console.log(e);
      alert("it seems that the cv file is corrupted. Sorry ):");
    }
  };

  const loadCV = ev => {
      const file = ev.target.files[0];

      const reader = new FileReader();
      reader.onload = () => processCV(reader.result);

      try {
          reader.readAsText(file);
      } catch (e) {
          if (e instanceof TypeError)
              console.log('no file selected, ', e.message);
          else
              console.log('unknown error', e.message);
      }

  };

  async function fetchAsync(link) {
      const response = await fetch(link);
      return await response.json();  
  }

  async function templateCV() {
      const data = await fetchAsync('https://api.github.com/gists/22e69fd2edb08b666f01b46eea4c5cff');
      const content = data.files['template.cv'].content;    
      processCV(content);
  }

  const print = () => window.print();

  const shareCV = _ => {
    const jsonOutput = domToJSON("CV");

    const zip = pako.deflate(jsonOutput, { to: "string" });
    const base64 = btoa(zip);
    window.location.hash = base64;
    document.getElementById("hashInput").value = window.location.href;
  };

  const setupClipboard = buttonId => {
    const clipboard = new ClipboardJS(`#${buttonId}`);
    clipboard.on("success", ev => {
      ev.clearSelection();
    });

    clipboard.on("error", ev => {
      console.log("something went wrong with link copying:");
      console.log(ev);
    });
  };

  const processInput = ({ hash }) => {
    switch (true) {
      case hash.length > 0:
        const h = hash.replace(/^#/, "");
        const decodedBase64 = atob(h);
        const unzip = pako.inflate(decodedBase64, { to: "string" });
        processCV(unzip);
        break;
      case localStorage.getItem("content") &&
        localStorage.getItem("content").length > 0:
        processCV(localStorage.getItem("content"));
        break;
      default:
        newCV();
    }
  };

  const saveAndShowAlert = ({ jsonOutput }) => {
    localStorage.setItem("content", jsonOutput);
    swal({
      title: "Saved",
      text: "Your CV has been saved!",
      icon: "success",
      button: false,
      timer: 3000
    });
  };

  const saveInBrowser = () => {
    const jsonOutput = domToJSON("CV");
    if (localStorage.getItem("content")) {
      swal({
        title: "Confirm Overwriting",
        text: "Are you sure you want to overwrite the CV you've saved before?",
        dangerMode: true,
        buttons: true,
        icon: "warning",
        closeOnClickOutside: false,
        closeOnEsc: false
      }).then(val => {
        if (val) saveAndShowAlert({ jsonOutput });
      });
    } else {
      saveAndShowAlert({ jsonOutput });
    }
  };

  var bodyHtml = "<h1>resume-maker</h1>\n<p>A simple interactive resume-making tool. Live version is here: <a href=\"https://danplisetsky.github.io/resume-maker/\">https://danplisetsky.github.io/resume-maker/</a></p>\n<h2>How to use</h2>\n<ul>\n<li>Edit text by double-clicking an element</li>\n<li>Change colors by clicking an element once and choosing the color at the right-hand corner</li>\n<li>Hover over elements for more options</li>\n<li>Create links from elements when you need it (for instance, if your blog is at <code>https://www.example.com/coolblog</code>, just enter <code>example.com/coolblog</code> and create a link)\n<ul>\n<li>Some links are smarter than others! For twitter, @coolhandle is enough, for github your profile name will suffice, and for email -- well, punch in your email address and click on the link icon!</li>\n</ul>\n</li>\n<li>Check out the template resume to get an idea of what you can create!</li>\n<li>Save your resume:\n<ul>\n<li>Locally, by clicking on the Save Resume on Disk button and choosing where to save the file</li>\n<li>Creating a shareable link, by clicking on the Generate Shareable Link button</li>\n<li>In the browser, by clicking on the Save in Browser button</li>\n</ul>\n</li>\n<li>Note that on mobile devices it's not meant to be used for editing, just for viewing</li>\n</ul>\n<h2>Thanks</h2>\n<p>Inspired by Anjana Vakil's <a href=\"https://vakila.github.io/docs/Vakil-Resume.pdf\">CV</a></p>\n<p>Icons made by <a href=\"https://www.flaticon.com/authors/alfredo-hernandez\" title=\"Alfredo Hernandez\">Alfredo Hernandez</a> from <a href=\"https://www.flaticon.com/\" title=\"Flaticon\">www.flaticon.com</a> is licensed by <a href=\"http://creativecommons.org/licenses/by/3.0/\" title=\"Creative Commons BY 3.0\">CC 3.0 BY</a></p>\n";

  const parseHtml = htmlString => {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div;
  };

  const getInstructionsFromReadme = htmlString => {
    const regex = /<h2>How to use<\/h2>(.+)<h2>/;
    const instructions = regex.exec(htmlString)[1];
    return parseHtml(instructions);
  };

  const showHelp = () => {
    swal({
      title: "How to Use",
      icon: "info",
      button: false,
      content: getInstructionsFromReadme(bodyHtml.replace(/\n/g, "")),
      className: "swal-help"
    });
  };

  window.onload = () => {
    const buttonsAndBehaviors = [
      {
        id: "newCVButton",
        callback: newCV
      },
      {
        id: "saveCVButton",
        callback: saveCV
      },
      {
        id: "loadCVButton",
        callback: loadCV
      },
      {
        id: "templateCVButton",
        callback: templateCV
      },
      {
        id: "printButton",
        callback: print
      },
      {
        id: "shareCVButton",
        callback: shareCV
      },
      {
        id: "saveInBrowser",
        callback: saveInBrowser
      },
      {
        id: "helpButton",
        callback: showHelp
      }
    ];

    buttonsAndBehaviors.forEach(bab => attachButtonBehavior(bab));

    setupClipboard("shareCVButton");
    processInput({ hash: window.location.hash });
  };

  window.onbeforeunload = ev => {
    const msg = "Please don't go without saving your work… ";
    ev.returnValue = msg;
    return msg;
  };

}());
