// --- SECURITY CHECK ---
// Grab the Firebase ID we saved during login
const firebaseUid = localStorage.getItem('firebase_uid');
if (!firebaseUid) {
    // If they aren't logged in, kick them back to the login page!
    window.location.href = "login.html";
}

// --- SUPABASE INITIALIZATION ---
const supabaseUrl = 'https://gbpxlfzidziwjbdvxfbb.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicHhsZnppZHppd2piZHZ4ZmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDYxMDksImV4cCI6MjA4ODMyMjEwOX0.vjSl7ncV_fLYTTfv2Qzy7D0SqBO4i8TbvtwQvC-iy0Q';

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// --- USER AUTHENTICATION ---
let myUserId = localStorage.getItem('dshare_user_id');
if (!myUserId) {
    myUserId = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('dshare_user_id', myUserId);
}

// --- APP STATE ---
let currentFolderId = null; 
let vaultData = []; 
let clipboard = { action: null, items: [] }; 

// --- SELECTION STATE ---
let isSelectMode = false;
let selectedItems = new Set();

// --- DOM ELEMENTS ---
const fileGrid = document.getElementById('fileGrid');
const addFolderBtn = document.getElementById('addFolderBtn');
const backBtn = document.getElementById('backBtn');
const viewTitle = document.getElementById('viewTitle');
const fileInput = document.getElementById('fileInput');
const selectBtn = document.getElementById('selectBtn');
const actionBar = document.getElementById('actionBar');
const pasteBtn = document.getElementById('pasteBtn');

// --- SELECTION LOGIC ---
selectBtn.onclick = () => {
    isSelectMode = !isSelectMode;
    selectedItems.clear(); // Clear selections when toggling
    
    // Update UI
    selectBtn.innerText = isSelectMode ? "Cancel" : "Select";
    selectBtn.style.background = isSelectMode ? "#333" : "transparent";
    actionBar.style.display = isSelectMode ? 'flex' : 'none';
    
    render();
};

window.handleAction = async (action) => {
    if (selectedItems.size === 0) return alert("Please select at least one item.");

    if (action === 'copy' || action === 'cut') {
        // Save full item objects to clipboard
        clipboard.action = action;
        clipboard.items = Array.from(selectedItems).map(id => vaultData.find(i => i.id === id));
        
        alert(`Copied ${clipboard.items.length} item(s)! Go to a folder and click Paste.`);
        
        // Turn off select mode and show paste button
        selectBtn.click(); 
        pasteBtn.style.display = 'block';
    } 
    else if (action === 'delete') {
        if (confirm(`Delete ${selectedItems.size} item(s)?`)) {
            for (let itemId of selectedItems) {
                const item = vaultData.find(i => i.id === itemId);
                if (item.type === 'file' && item.file_path) {
                    const { data: refs } = await supabaseClient.from('vault_items').select('id').eq('file_path', item.file_path);
                    if (refs && refs.length <= 1) await supabaseClient.storage.from('vault').remove([item.file_path]);
                }
                await supabaseClient.from('vault_items').delete().eq('id', itemId);
            }
            selectBtn.click(); // Turn off select mode
            fetchVaultData();
        }
    }
};

pasteBtn.onclick = async () => {
    if (!clipboard.items.length) return;
    
    pasteBtn.innerText = "Pasting...";
    for (let item of clipboard.items) {
        if (clipboard.action === 'cut') {
            await supabaseClient.from('vault_items').update({ parent: currentFolderId }).eq('id', item.id);
        } else if (clipboard.action === 'copy') {
            await supabaseClient.from('vault_items').insert([{
                name: item.name, type: item.type, parent: currentFolderId, file_path: item.file_path, user_id: firebaseUid
            }]);
        }
    }
    
    if (clipboard.action === 'cut') {
        clipboard = { action: null, items: [] }; // Clear clipboard after cutting
        pasteBtn.style.display = 'none';
    }
    
    pasteBtn.innerText = "Paste";
    fetchVaultData();
};

// --- FETCH & RENDER ---
async function fetchVaultData() {
    const { data, error } = await supabaseClient.from('vault_items').select('*').eq('user_id', firebaseUid);
    if (!error) { vaultData = data; render(); }
}

function render() {
    fileGrid.innerHTML = "";
    const items = vaultData.filter(item => item.parent === currentFolderId);

    items.forEach(item => {
        const box = document.createElement('div');
        box.className = 'item-box';
        
        // Highlight logic for Selection Mode
        if (isSelectMode && selectedItems.has(item.id)) {
            box.style.border = "2px solid #6366f1";
            box.style.background = "rgba(99, 102, 241, 0.1)";
        } else {
            box.style.border = "none";
            box.style.background = "#1e1e24"; // Your default box color
        }

        const icon = item.type === 'folder' ? 'bx-folder folder-clr' : 'bx-image-alt file-clr';
        
        // Add a checkmark visual if selected
        const checkVisual = (isSelectMode && selectedItems.has(item.id)) ? `<i class='bx bxs-check-circle' style='position:absolute; top:10px; right:10px; color:#6366f1; font-size:20px;'></i>` : '';
        
        box.innerHTML = `${checkVisual}<i class='bx ${icon}'></i><span>${item.name}</span>`;
        box.style.position = 'relative'; // Needed for the checkmark
        
        box.onclick = async () => {
            if (isSelectMode) {
                // Toggle selection
                if (selectedItems.has(item.id)) selectedItems.delete(item.id);
                else selectedItems.add(item.id);
                render();
            } else {
                // Normal open behavior
                if (item.type === 'folder') {
                    currentFolderId = item.id; viewTitle.innerText = item.name; backBtn.classList.remove('invisible'); render();
                } else if (item.type === 'file') {
                    const { data } = supabaseClient.storage.from('vault').getPublicUrl(item.file_path); window.open(data.publicUrl, '_blank');
                }
            }
        };

        fileGrid.appendChild(box);
    });
}

// --- ADDING FILES/FOLDERS ---
addFolderBtn.onclick = async () => {
    if (currentFolderId === null) {
        const name = prompt("Folder Name:");
        if (name) { await supabaseClient.from('vault_items').insert([{ name: name, type: 'folder', parent: null, user_id: firebaseUid }]); fetchVaultData(); }
    } else { fileInput.click(); }
};

fileInput.onchange = async (e) => {
    if (e.target.files.length === 0) return;
    for (let file of e.target.files) {
        const filePath = `${Date.now()}-${file.name}`;
        const { error } = await supabaseClient.storage.from('vault').upload(filePath, file);
        if (!error) await supabaseClient.from('vault_items').insert([{ name: file.name, type: 'file', parent: currentFolderId, file_path: filePath, user_id: firebaseUid }]);
    }
    e.target.value = ''; fetchVaultData();
};

backBtn.onclick = () => { 
    currentFolderId = null; 
    viewTitle.innerText = "Main Vault"; 
    backBtn.classList.add('invisible'); 
    if(isSelectMode) selectBtn.click(); // Turn off select mode when going back
    render(); 
};

// --- RECURSIVE FOLDER COPY ENGINE ---
async function copyFolderContents(oldParentId, newParentId, userId) {
    const { data: children } = await supabaseClient.from('vault_items').select('*').eq('parent', oldParentId);
    if (!children || children.length === 0) return;
    for (let child of children) {
        const { data: newChild } = await supabaseClient.from('vault_items').insert([{
            name: child.name, type: child.type, parent: newParentId, file_path: child.file_path, user_id: userId
        }]).select();
        if (child.type === 'folder' && newChild) await copyFolderContents(child.id, newChild[0].id, userId);
    }
}

// --- MODALS & TRANSFER LOGIC ---
const originalOpenModal = window.openModal;
window.openModal = async (modalId) => {
    originalOpenModal(modalId);
    
    if(modalId === 'receiveModal') {
        setTimeout(async () => {
            const senderId = prompt("Enter the Sender's 6-digit ID:");
            if(!senderId) return closeModal('receiveModal');
            
            const { data, error } = await supabaseClient.from('active_shares').select('*, vault_items(*)').eq('receiver_id', myUserId).eq('sender_id', senderId);
            
            if(error || !data || data.length === 0) {
                alert("No files found from that user.");
                closeModal('receiveModal');
                return;
            }

            let receivedFolderId = null;
            const hasLooseFiles = data.some(share => share.vault_items.type === 'file');
            
            if (hasLooseFiles) {
                const folderName = `Received from ${senderId}`;
                const { data: newFolder } = await supabaseClient.from('vault_items').insert([{ name: folderName, type: 'folder', parent: currentFolderId, user_id: firebaseUid }]).select();
                receivedFolderId = newFolder[0].id;
            }

            let html = '';
            for(let share of data) {
                const item = share.vault_items;
                if(!item) continue;
                
                const targetParent = item.type === 'file' ? receivedFolderId : currentFolderId;
                const { data: copiedItem } = await supabaseClient.from('vault_items').insert([{ name: item.name, type: item.type, parent: targetParent, file_path: item.file_path, user_id: firebaseUid }]).select();
                if (item.type === 'folder' && copiedItem) await copyFolderContents(item.id, copiedItem[0].id, firebaseUid);
                
                await supabaseClient.from('transfer_history').insert([{ file_name: item.name, action: 'received', user_id: firebaseUid }]);
                await supabaseClient.from('active_shares').delete().eq('id', share.id);
                
                html += `<div style="padding:15px; background:#1e1e24; border-radius:8px; margin-bottom:10px; display:flex; align-items:center; gap:10px;"><i class='bx ${item.type === 'folder' ? 'bx-folder' : 'bx-file'}' style="color:#6366f1; font-size:24px;"></i><span>${item.name}</span></div>`;
            }
            document.querySelector('.receive-list').innerHTML = html;
            fetchVaultData();
        }, 300);
    }
    
    if(modalId === 'historyModal') {
        const { data } = await supabaseClient.from('transfer_history').select('*').eq('user_id', firebaseUid).order('created_at', { ascending: false });
        const list = document.querySelector('.history-list');
        list.innerHTML = data && data.length ? '' : '<p class="empty-state">No history yet.</p>';
        (data || []).forEach(log => {
            const isSent = log.action === 'sent';
            list.innerHTML += `<div class="history-item"><div class="history-icon ${isSent ? 'sent' : 'received'}"><i class='bx ${isSent ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt'}'></i></div><div class="item-info"><h4>${log.file_name}</h4><p>${log.action.charAt(0).toUpperCase() + log.action.slice(1)}</p></div><span class="status-text">${isSent ? 'Done' : 'Saved'}</span></div>`;
        });
    }
};

window.nextStep = function() {
    const receiverId = document.getElementById('real-pin').value;
    if (receiverId.length === 6) {
        document.getElementById('pin-error').style.display = 'none';
        document.getElementById('send-step-1').classList.remove('active');
        document.getElementById('send-step-2').classList.add('active');
        
        const list = document.querySelector('.file-selection-list');
        list.innerHTML = '';
        const items = vaultData.filter(item => item.parent === currentFolderId);
        
        if(items.length === 0) {
            list.innerHTML = '<p style="color:#888; text-align:center;">This folder is empty.</p>';
        } else {
            items.forEach(item => {
                list.innerHTML += `<label class="file-item" style="cursor:pointer; display: flex; align-items: center; gap: 10px; margin-bottom: 10px;"><input type="checkbox" value="${item.id}" class="send-checkbox"><span class="icon">${item.type === 'folder' ? '📁' : '📄'}</span><span class="name">${item.name}</span></label>`;
            });
        }
    } else {
        document.getElementById('pin-error').style.display = 'block';
        const wrapper = document.querySelector('.pin-visuals');
        wrapper.style.animation = 'shake 0.3s ease'; setTimeout(() => wrapper.style.animation = '', 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.querySelector('.modal-action-btn.success');
    if(sendBtn) {
        sendBtn.onclick = async () => {
            const receiverId = document.getElementById('real-pin').value;
            const checkboxes = document.querySelectorAll('.send-checkbox:checked');
            if(checkboxes.length === 0) return alert("Please select at least one file or folder.");
            
            sendBtn.innerText = "Sending...";
            for(let cb of checkboxes) {
                const itemId = cb.value;
                const item = vaultData.find(i => i.id === itemId);
                await supabaseClient.from('active_shares').insert([{ sender_id: myUserId, receiver_id: receiverId, item_id: itemId }]);
                await supabaseClient.from('transfer_history').insert([{ file_name: item.name, action: 'sent', user_id: firebaseUid }]);
            }
            alert(`Success! Files sent to User ID: ${receiverId}`);
            sendBtn.innerText = "Send Now";
            closeModal('sendModal');
        };
    }
});

fetchVaultData();