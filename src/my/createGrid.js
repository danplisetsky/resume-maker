import createElement from './createElement';
import createSection from './createSection';
import createTextElement from './createTextElement';
import createDescriptionElement from './createDescriptionElement';
import createListElement from './createListElement';
import createCompoundItem from './createCompoundItem';
import createDetailElement from './createDetailElement';

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

        const processTextElement = ([fstChild, ...rest]) =>
            createTextElement(fstChild.textContent);

        const processDescriptionElement = ([fstChild, ...rest], args = []) => {
            return !fstChild
                ? createDescriptionElement(...args)
                : fstChild.classList.contains('description')
                    ? processDescriptionElement(rest, args.concat(fstChild.innerText))
                    : fstChild.classList.contains('descriptionText')
                        ? processDescriptionElement(rest, args.concat(fstChild.innerText))
                        : processDescriptionElement(rest, args);
        };

        const processListElement = ([fstChild, ...rest], args = []) => {
            return !fstChild
                ? args
                : fstChild.classList.contains('description')
                    ? createListElement(fstChild.innerText, processListElement(rest))
                    : fstChild.classList.contains('textElement')
                        ? processListElement(
                            rest,
                            args.concat(
                                createTextElement(fstChild.innerText)))
                        : processListElement(rest, args);
        };

        const processCompoundItem = ([fstChild, ...rest], [argsMeta = {}, ...argsChildren] = []) => {

            const addToArgsMeta = obj => Object.assign(argsMeta, obj);

            if (!fstChild) return createCompoundItem(argsMeta, argsChildren);
            else {
                const classList = fstChild.classList;
                switch (true) {
                    case classList.contains('compoundItemName'):
                        return processCompoundItem(rest, [
                            addToArgsMeta({
                                name: fstChild.innerText
                            })
                        ]);
                    case classList.contains('compoundItemDescription'):
                        return processCompoundItem(rest, [
                            addToArgsMeta({
                                description: fstChild.innerText
                            })
                        ]);
                    case classList.contains('compoundItemAdditionalInfo'):
                        return processCompoundItem(rest, [
                            addToArgsMeta({
                                additionalInfo: fstChild.innerText
                            })
                        ]);
                    case classList.contains('compoundItemDetails'):
                        return processCompoundItem(fstChild.childNodes, [argsMeta]);
                    case classList.contains('detailElement'):
                        return processCompoundItem(rest, [
                            argsMeta,
                            ...argsChildren,
                            createDetailElement(fstChild.innerText)
                        ]);
                    default:
                        return processCompoundItem(rest, [argsMeta, ...argsChildren]);
                }
            }
        };

        const processDateItem = ([fstElement, ...rest]) => {

        };

        const processChildren = ([fstElement, ...rest], children = []) => {

            const processChild = fn => {
                return processChildren(
                    rest,
                    children.concat(
                        fn(fstElement.childNodes)
                    ));
            }

            if (!fstElement) return children;
            else {
                const classList = fstElement.classList;
                switch (true) {
                    case classList.contains('textElement'):
                        return processChild(
                            processTextElement);
                    case classList.contains('descriptionElement'):
                        return processChild(
                            processDescriptionElement);
                    case classList.contains('listElement'):
                        return processChild(
                            processListElement);
                    case classList.contains('compoundItem'):
                        return processChild(
                            processCompoundItem);
                    case classList.contains('dateItem'):
                        return processChild(
                            processDateItem);
                    default:
                        return processChildren(rest, children);
                }
            }
        };

        return fst.hasOwnProperty('name')
            ? createSection(
                id,
                fst.name,
                fst.color,
                processChildren(rest))
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