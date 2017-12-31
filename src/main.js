import attachButtonBehavior from './my/attachButtonBehavior';
import newCV from './my/newCV';
import saveCV from './my/saveCV';
import loadCV from './my/loadCV';

window.onload = () => {
    attachButtonBehavior('newCVButton', newCV);
    attachButtonBehavior('saveCVButton', saveCV);
    attachButtonBehavior('loadCVButton', loadCV);
    newCV();
};