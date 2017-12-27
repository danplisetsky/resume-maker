import createHeader from "./createHeader";
import { removeAllChildren } from './extensions';


// const foo = node => {
//     console.log(node.tagName, node.id, node.className, node.innerText);    
//     if (!node.childNodes) return
//     else[...node.childNodes].forEach(cn => foo(cn));
// };

const processHeader = (node, id) => {
    if (!node || !node.childNodes) return;
    else {
        switch (node.id) {
            case 'header':
                return createHeader(
                    {
                        headerBackgroundColor: node.style.backgroundColor
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


const loadCV = ev => {
    const file = ev.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
        const domCV = domJSON.toDOM(reader.result)
            .firstElementChild;
        const header = processHeader([...domCV.childNodes].find(cn => cn.id === 'header'));

        const CV = document.getElementById('CV');
        CV.removeAllChildren();
        CV.appendChild(header);        

        // foo(domCV);

        //TODO: call createNewCV here
    };

    reader.readAsText(file);

};

export default loadCV;