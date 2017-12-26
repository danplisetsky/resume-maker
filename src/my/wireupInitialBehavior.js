import forEachElem from './forEachElem';
import attachBckgColorPicker from './attachBckgColorPicker';
import attachEditBehavior from './attachEditBehavior';
import attachColorPicker from './attachColorPicker';

const wireupInitialBehavior = () => {
    forEachElem('.canPickBackgroundColor')(attachBckgColorPicker);
    forEachElem('.canEdit')(attachEditBehavior);
    forEachElem('.canPickColor')(attachColorPicker);
};

export default wireupInitialBehavior;