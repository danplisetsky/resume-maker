const attachButtonBehavior = (id, callback) => {
    const button = document.getElementById(id);
    button.onclick = callback;
};

export default attachButtonBehavior;