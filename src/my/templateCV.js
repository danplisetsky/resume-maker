import processCV from "./processCV";

async function fetchAsync(link) {
    const response = await fetch(link);
    return await response.json();  
}

async function templateCV() {
    const data = await fetchAsync('https://api.github.com/gists/22e69fd2edb08b666f01b46eea4c5cff');
    const content = data.files['template.cv'].content;    
    processCV(content);
} 

export default templateCV;