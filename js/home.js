let currentFolderId = null; 
let vaultData = []; 

const fileGrid = document.getElementById('fileGrid');
const addFolderBtn = document.getElementById('addFolderBtn');
const backBtn = document.getElementById('backBtn');
const viewTitle = document.getElementById('viewTitle');
const fileInput = document.getElementById('fileInput');

function render() {
    fileGrid.innerHTML = "";
    const items = vaultData.filter(item => item.parent === currentFolderId);

    items.forEach(item => {
        const box = document.createElement('div');
        box.className = 'item-box';
        const icon = item.type === 'folder' ? 'bx-folder folder-clr' : 'bx-image-alt file-clr';
        
        box.innerHTML = `<i class='bx ${icon}'></i><span>${item.name}</span>`;
        
        // 1. Click to Open
        box.onclick = () => {
            if (item.type === 'folder') {
                currentFolderId = item.id;
                viewTitle.innerText = item.name;
                backBtn.classList.remove('invisible');
                render();
            }
        };

        // 2. Long Press to Delete (Right-click for PC)
        box.oncontextmenu = (e) => {
            e.preventDefault(); // Stop default menu
            if(confirm(`Delete "${item.name}"?`)) {
                vaultData = vaultData.filter(i => i.id !== item.id);
                render();
            }
        };

        fileGrid.appendChild(box);
    });
}

// Create Folder or Upload File logic (Same as before)
addFolderBtn.onclick = () => {
    if (currentFolderId === null) {
        const name = prompt("Folder Name:");
        if (name) {
            vaultData.push({ id: Date.now(), name: name, type: 'folder', parent: null });
            render();
        }
    } else {
        fileInput.click();
    }
};

fileInput.onchange = (e) => {
    for (let file of e.target.files) {
        vaultData.push({ id: Date.now(), name: file.name, type: 'file', parent: currentFolderId });
    }
    render();
};

backBtn.onclick = () => {
    currentFolderId = null;
    viewTitle.innerText = "Main Vault";
    backBtn.classList.add('invisible');
    render();
};

render();