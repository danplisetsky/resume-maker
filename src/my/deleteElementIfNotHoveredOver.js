const deleteElementIfNotHoveredOver = (
    elem,
    [
        [clientX, clientY],
        { left = 0, top = 0, right = 0, bottom = 0 }
    ]) => {
    const coord = elem.getBoundingClientRect();
    if (!(coord.left <= clientX + left && clientX - right <= coord.right && coord.top <= clientY + top && clientY - bottom <= coord.bottom))
        elem.remove();
};

export default deleteElementIfNotHoveredOver;