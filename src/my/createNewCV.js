import { removeAllChildren } from './extensions';

const createNewCV = (id, header, grid) => {
    const loadCVButton = document.getElementById('loadCVButton');
    loadCVButton.value = null;
    
    const CV = document.getElementById(id);
    removeAllChildren(CV);
    CV.appendChild(header);
    CV.appendChild(grid);
};

export default createNewCV;