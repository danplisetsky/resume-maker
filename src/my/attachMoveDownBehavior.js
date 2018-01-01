import { moveDown } from './extensions';
import attachMovingBehavior from './attachMovingBehavior';

const attachMoveDownBehavior = el => {
    attachMovingBehavior(el)(moveDown);
};  

export default attachMoveDownBehavior;