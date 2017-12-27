import createElement from './createElement';
import createSection from './createSection';

const createGrid = ([fstColumn, sndColumn]) => {

    const createColumn = ({ id, name }) => {
        return createElement('div', {
            id: id,
            className: 'subgrid',
            children: [
                createSection(id, name)
            ]
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