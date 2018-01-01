import { moveUp } from './extensions';
import attachMovingBehavior from './attachMovingBehavior';

const attachMoveUpBehavior = el => {  
    attachMovingBehavior(el)(moveUp);
}

export default attachMoveUpBehavior;