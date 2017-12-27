const saveCV = () => {
    const CV = document.getElementById('CV');

    const jsonOutput = domJSON.toJSON(CV, {
        attributes: [false, 'id', 'class', 'style'],
        domProperties: [false, 'alt'],
        stringify: true
    });

    const name = document.getElementById('name').innerText + '.cv';
    const blob = new Blob([jsonOutput], {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, name);
};

export default saveCV;