import createHeader from "./createHeader";
import { removeAllChildren } from './extensions';
import createGrid from "./createGrid";

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


const loadCV = ev => {
    const file = ev.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
        const domCV = domJSON.toDOM(reader.result)
            .firstElementChild;
        const header = processHeader(
            [...domCV.childNodes].find(cn => cn.id === 'header'));
        const grid = processGrid(
            [...domCV.childNodes].find(cn => cn.id === 'grid'));

        //TODO: call createNewCV here

        const CV = document.getElementById('CV');
        CV.removeAllChildren();
        CV.appendChild(header);
        CV.appendChild(grid);
    };

    reader.readAsText(file);

};

export default loadCV;