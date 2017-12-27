import createHeader from './createHeader';
import createGrid from './createGrid';
import randomName from './randomName';

const newCV = () => {
    const CV = document.getElementById('CV');
    CV.removeAllChildren();
    CV.appendChild(
        createHeader(randomName(), 'software developer'));
    CV.appendChild(
        createGrid([
            {
                id: 'fstColumn',
                name: 'contact'
            },
            {
                id: 'sndColumn',
                name: 'experience'
            }
        ]));
};

export default newCV;