const addStrikethrough = el => {
    const classList = el.classList;

    switch(true) {
        case classList.contains("textElement"):
            el.style['textDecoration'] = el.style['textDecoration'] === 'line-through'
                ? ''
                : 'line-through';
            return el;
    }
}

export default addStrikethrough;
