import attachButtonBehavior from './my/attachButtonBehavior';
import newCV from './my/newCV';
import saveCV from './my/saveCV';
import loadCV from './my/loadCV';
import templateCV from './my/templateCV';
import print from './my/print';

window.onload = () => {
    attachButtonBehavior('newCVButton')(newCV);
    attachButtonBehavior('saveCVButton')(saveCV);
    attachButtonBehavior('loadCVButton')(loadCV);
    attachButtonBehavior('templateCVButton')(templateCV);
    attachButtonBehavior('printButton')(print);
    newCV();
};