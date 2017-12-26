import { removeAllChildren } from './extensions';
import createSection from './createSection';
import setInitialAttributes from './setInitialAttributes';
import wireupInitialBehavior from './wireupInitialBehavior';
import randomName from './randomName';
import forEachElem from './forEachElem';

const newCV = () => {
    const cleanColumn = (column, [nameOfFirstSection]) => {
        column.removeAllChildren();
        column.appendChild(createSection(column, nameOfFirstSection))
    };

    setInitialAttributes('header')();
    setInitialAttributes('name')(randomName());
    setInitialAttributes('occupation')('software developer');
    wireupInitialBehavior(); //for elements always present on page

    forEachElem('#fstColumn')(cleanColumn, 'contact');
    forEachElem('#sndColumn')(cleanColumn, 'experience');
};

export default newCV;