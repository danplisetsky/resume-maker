import processCV from "./processCV";

const loadCV = ev => {
    const file = ev.target.files[0];

    const reader = new FileReader();
    reader.onload = () => processCV(reader.result);

    try {
        reader.readAsText(file);
    } catch (e) {
        if (e instanceof TypeError)
            console.log('no file selected, ', e.message);
        else
            console.log('unknown error', e.message);
    }

};

export default loadCV;