import createElement from "./createElement";
import createSection from "./createSection";
import createTextElement from "./createTextElement";
import createDescriptionElement from "./createDescriptionElement";
import createListElement from "./createListElement";
import createCompoundItem from "./createCompoundItem";
import createDetailElement from "./createDetailElement";
import createDateItem from "./createDateItem";
import createDetailsElement from "./createDetailsElement";
import createLinkElement from "./createLinkElement";
import createDescriptionLinkElement from "./createDescriptionLinkElement";

const createGrid = (
  fstColumn = {
    id: "fstColumn",
    children: [
      [{ name: "contact", color: null }],
      [{ name: "skills", color: null }]
    ]
  },
  sndColumn = {
    id: "sndColumn",
    children: [
      [{ name: "experience", color: null }],
      [{ name: "education", color: null }]
    ]
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

    const processTextElement = ([fstChild], { style }) => {
      return createTextElement({
        text: fstChild.textContent,
        style: { 'textDecoration': style['textDecoration'] }
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
      const processChild = (fn, extra) => {
        return processChildren(
          rest,
          children.concat(fn(fstElement.childNodes, extra))
        );
      };

      if (!fstElement) return children;
      else {
        const classList = fstElement.classList;
        switch (true) {
          case classList.contains("textElement"):
            return processChild(processTextElement, { style: fstElement.style });
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

export default createGrid;
