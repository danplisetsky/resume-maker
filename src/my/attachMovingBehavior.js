const attachMovingBehavior = el => {
    return fn => {
        el.nextElementSibling.remove(); //remove action container
        if (el.className.includes('deleteParent'))
            fn(el.parentNode);
        else
            fn(el);
    };
};

export default attachMovingBehavior;