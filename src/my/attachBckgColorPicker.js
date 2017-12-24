import createElement from './createElement'

const attachBckgColorPicker = el => {

    const createColorPicker = () => {
        return createElement('input', {
            type: 'color',
            onchange: ev =>
                el.style.backgroundColor = ev.target.value
        });
    };

    el.addEventListener('dblclick', () =>
        createColorPicker().click());
};

export default attachBckgColorPicker;