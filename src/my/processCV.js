import createHeader from "./createHeader";
import createGrid from "./createGrid";
import createNewCV from "./createNewCV";

const processHeader = (node, id) => {
    if (!node || !node.childNodes) return;
    else {
        switch (node.id) {
            case 'header':
                return createHeader(
                    {
                        backgroundColor: node.style.backgroundColor
                    },
                    processHeader(node.firstElementChild, 'name'),
                    processHeader(node.firstElementChild, 'occupation')
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
            : fstElement.classList.contains('nameOfSection')
                ? processSection(
                    rest,
                    children.concat({
                        name: fstElement.innerText,
                        color: fstElement.style.color
                    }))
                : processSection(rest, children.concat(fstElement))
    };

    const processSubgrid = ([fstSection, ...rest], children = []) => {
        return !fstSection
            ? children
            : processSubgrid(
                rest,
                [
                    ...children,
                    processSection(fstSection.childNodes)
                ]);
    };

    return (!node || !node.childNodes)
        ? (() => { throw 'wrongly formatted cv!' })
        : node.id === 'grid'
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
        const domCV = domJSON.toDOM(jsonCV)
            .firstElementChild;
        const header = processHeader(
            [...domCV.childNodes].find(cn => cn.id === 'header'));
        const grid = processGrid(
            [...domCV.childNodes].find(cn => cn.id === 'grid'));

        createNewCV(domCV.id, header, grid);
    } catch (e) {
        if (e instanceof SyntaxError) {
            console.log('file is wrongly formatted ', e.message);
        }
        else
            console.log('unknown error', e.message);
        alert('it seems that the cv file is corrupted. Sorry ):');
    }
};

export default processCV;