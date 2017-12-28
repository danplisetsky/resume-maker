import createElement from './createElement';
import createSection from './createSection';
import createTextElement from './createTextElement';
import createDescriptionElement from './createDescriptionElement';

const createGrid = (
    fstColumn = {
        id: 'fstColumn',
        children: [
            [
                { name: 'contact', color: null }
            ]
        ]
    },
    sndColumn = {
        id: 'sndColumn',
        children: [
            [
                { name: 'experience', color: null }
            ]
        ]
    }) => {

    const makeCreateSection = (id, [fst, ...rest]) => {

        const processTextElement = node =>
            createTextElement(node.innerText);

        const processDescriptionElement = ([fstChild, ...rest], args = []) => {
            return !fstChild
                ? createDescriptionElement(...args)
                : fstChild.classList.contains('description')
                    ? processDescriptionElement(rest, args.concat(fstChild.innerText))
                    : fstChild.classList.contains('descriptionText')
                        ? processDescriptionElement(rest, args.concat(fstChild.innerText))
                        : processDescriptionElement(rest, args);
        };

        const processChidren = ([fstElement, ...rest], children = []) => {
            if (!fstElement) return children;
            else {
                const classList = fstElement.classList;
                switch (true) {
                    case classList.contains('textElement'):
                        return processChidren(rest,
                            children.concat(processTextElement(fstElement)));
                    case classList.contains('descriptionElement'):
                        return processChidren(rest,
                            children.concat(processDescriptionElement(fstElement.childNodes)));
                    default:
                        return processChidren(rest, children);
                }
            }
        };

        return fst.hasOwnProperty('name')
            ? createSection(
                id,
                fst.name,
                fst.color,
                processChidren(rest))
            : (() => { throw 'wrongly formatted CV!' });
    };

    const createColumn = ({
        id,
        children
    }) => {
        const sections = children.map(section => makeCreateSection(id, section));
        return createElement('div', {
            id: id,
            className: 'subgrid',
            children: sections
        });
    };

    return createElement('div', {
        id: 'grid',
        children: [
            createColumn(fstColumn),
            createColumn(sndColumn)
        ]
    });
};

export default createGrid;