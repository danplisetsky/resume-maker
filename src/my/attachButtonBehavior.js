const attachButtonBehavior = (id, callback) => {
    const button = document.getElementById(id);
    if (button.tagName === 'INPUT' && button.type === 'file')
        button.onchange = callback;
    else
        button.onclick = callback;
};

export default attachButtonBehavior;