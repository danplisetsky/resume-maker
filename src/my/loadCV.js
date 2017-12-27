import setInitialAttributes from "./setInitialAttributes";

// const foo = node => {
//     console.log(node.tagName, node.id, node.className, node.innerText);    
//     if (!node.childNodes) return
//     else[...node.childNodes].forEach(cn => foo(cn));
// };

const processHeader = node => {
    if (!node.childNodes) return;
    else {
        switch (node.id) {
            case 'header':
                setInitialAttributes('header')(null, node.style.backgroundColor);
                break;
            case 'name':
            case 'occupation':
                setInitialAttributes(node.id)(node.innerText, node.style.color);
                break;
        }
        [...node.childNodes].forEach(cn => processHeader(cn));
    }
    //last line follows
    // wireupInitialBehavior();
};


const loadCV = ev => {
    const file = ev.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
        const domCV = domJSON.toDOM(reader.result)
            .firstElementChild;
        processHeader([...domCV.childNodes].find(cn => cn.id === 'header'));

        // foo(domCV);

        //TODO: deal with header
        //TODO: deal with grid        

        // console.log([domCV]);

        // const CV = document.getElementById('CV');
        // const domCV = domJSON.toDOM(res);
        // CV.parentNode.replaceChild(domCV, CV);
        // wireupBehavior();
    };

    reader.readAsText(file);

};

export default loadCV;