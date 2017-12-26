const setInitialAttributes = id => {
    const elem = document.getElementById(id);
    return (text = elem.innerHTML, color = null) => {
        elem.innerHTML = text;
        elem.className.includes('canPickBackgroundColor')
            ? elem.style.backgroundColor = color
            : elem.style.color = color;
    };
};

export default setInitialAttributes;