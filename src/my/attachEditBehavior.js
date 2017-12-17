import createElement from './createElement'

const attachEditBehavior = el => {

    const createInput = () => {
        const elStyle = getComputedStyle(el);
        const prevDisplay = el.style.display;

        const input = createElement('input', {
            type: 'text',
            value: el.innerText,
            style: {
                fontSize: elStyle.fontSize,
                fontWeight: elStyle.fontWeight
            },
            onkeydown: ev => {
                if (ev.code === 'Enter') {
                    el.innerText = input.value;
                    el.style.display = prevDisplay;
                    input.parentNode.remove();
                }
            }
        });

        return createElement('div', {
            children: [input]
        });
    };

    el.addEventListener('dblclick', ev => {
        const input = createInput();
        el.insertAfter(input);
        input.firstChild.focus();
        el.style.display = 'none';
        ev.stopPropagation();
    });
};

export default attachEditBehavior;