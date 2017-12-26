const setInitialAttributes = id => {
    const elem = document.getElementById(id);
    return (text, color = null) => {
        elem.innerHTML = text || elem.innerHTML;
        elem.className.includes('canPickBackgroundColor')
            ? elem.style.backgroundColor = color
            : elem.style.color = color;
    };
};

export default setInitialAttributes;