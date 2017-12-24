const randomName = () => {
    return Math.random() < 0.5
        ? 'John Doe'
        : 'Jane Doe';
};

export default randomName;