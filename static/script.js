let elements = [];
let draggedElement = null;

function addElementFromSelect() {
    const select = document.getElementById('element-type-select');
    const type = select.value;
    
    if (!type) {
        showNotification('Veuillez sélectionner un type d\'élément.', 'warning');
        return;
    }
    
    addElement(type);
    select.value = '';
}

function addElement(type) {
    const container = document.getElementById('elements-container');
    
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    const elementId = Date.now();
    const elementDiv = document.createElement('div');
    elementDiv.className = 'element-item';
    elementDiv.dataset.id = elementId;
    elementDiv.dataset.type = type;
    elementDiv.draggable = true;
    
    elementDiv.addEventListener('dragstart', handleDragStart);
    elementDiv.addEventListener('dragend', handleDragEnd);
    elementDiv.addEventListener('dragover', handleDragOver);
    elementDiv.addEventListener('drop', handleDrop);

    let elementHTML = '';
    const typeIcons = {
        'title': '📌',
        'text': '📄',
        'qrcode': '📱',
        'image': '🖼️',
        'separator': '➖',
        'space': '⬜',
        'barcode': '📊'
    };

    const typeLabels = {
        'title': 'Titre',
        'text': 'Paragraphe',
        'qrcode': 'QR Code',
        'image': 'Image',
        'separator': 'Ligne horizontale',
        'space': 'Espace vide',
        'barcode': 'Code-barres'
    };

    if (type === 'title') {
        elementHTML = `
            <div class="element-header">
                <span class="element-title">
                    <span class="drag-handle">⋮⋮</span>
                    ${typeIcons[type]} ${typeLabels[type]}
                </span>
                <button class="btn-remove" onclick="removeElement(${elementId})">✕</button>
            </div>
            <div class="element-content">
                <div class="input-group">
                    <label>Texte du titre</label>
                    <input type="text" class="element-input" placeholder="Entrez votre titre...">
                </div>
            </div>
        `;
    } else if (type === 'text') {
        elementHTML = `
            <div class="element-header">
                <span class="element-title">
                    <span class="drag-handle">⋮⋮</span>
                    ${typeIcons[type]} ${typeLabels[type]}
                </span>
                <button class="btn-remove" onclick="removeElement(${elementId})">✕</button>
            </div>
            <div class="element-content">
                <div class="input-group">
                    <label>Texte</label>
                    <textarea class="element-input" placeholder="Entrez votre texte..."></textarea>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" class="element-bold" id="bold-${elementId}">
                    <label for="bold-${elementId}">Texte en gras</label>
                </div>
            </div>
        `;
    } else if (type === 'qrcode') {
        elementHTML = `
            <div class="element-header">
                <span class="element-title">
                    <span class="drag-handle">⋮⋮</span>
                    ${typeIcons[type]} ${typeLabels[type]}
                </span>
                <button class="btn-remove" onclick="removeElement(${elementId})">✕</button>
            </div>
            <div class="element-content">
                <div class="input-group">
                    <label>URL ou texte</label>
                    <input type="text" class="element-input" placeholder="https://exemple.com">
                </div>
            </div>
        `;
    } else if (type === 'image') {
        elementHTML = `
            <div class="element-header">
                <span class="element-title">
                    <span class="drag-handle">⋮⋮</span>
                    ${typeIcons[type]} ${typeLabels[type]}
                </span>
                <button class="btn-remove" onclick="removeElement(${elementId})">✕</button>
            </div>
            <div class="element-content">
                <div class="input-group">
                    <label class="file-upload-btn">
                        <span class="icon">📁</span> Choisir une image
                        <input type="file" class="element-file" accept="image/*" onchange="handleFileSelect(this, ${elementId})">
                    </label>
                    <div class="file-name" id="filename-${elementId}">Aucun fichier</div>
                </div>
            </div>
        `;
    } else if (type === 'separator') {
        elementHTML = `
            <div class="element-header">
                <span class="element-title">
                    <span class="drag-handle">⋮⋮</span>
                    ${typeIcons[type]} ${typeLabels[type]}
                </span>
                <button class="btn-remove" onclick="removeElement(${elementId})">✕</button>
            </div>
            <div class="element-content">
                <p style="font-size: 0.75rem; color: #6B7280;">Ligne de séparation horizontale</p>
            </div>
        `;
    } else if (type === 'space') {
        elementHTML = `
            <div class="element-header">
                <span class="element-title">
                    <span class="drag-handle">⋮⋮</span>
                    ${typeIcons[type]} ${typeLabels[type]}
                </span>
                <button class="btn-remove" onclick="removeElement(${elementId})">✕</button>
            </div>
            <div class="element-content">
                <div class="input-group">
                    <label>Hauteur de l'espace (en pixels)</label>
                    <input type="number" class="element-input" value="30" min="10" max="200">
                </div>
            </div>
        `;
    } else if (type === 'barcode') {
        elementHTML = `
            <div class="element-header">
                <span class="element-title">
                    <span class="drag-handle">⋮⋮</span>
                    ${typeIcons[type]} ${typeLabels[type]}
                </span>
                <button class="btn-remove" onclick="removeElement(${elementId})">✕</button>
            </div>
            <div class="element-content">
                <div class="input-group">
                    <label>Code (numérique)</label>
                    <input type="text" class="element-input" placeholder="123456789012">
                </div>
            </div>
        `;
    }

    elementDiv.innerHTML = elementHTML;
    container.appendChild(elementDiv);
    
    elementDiv.style.animation = 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    
    const container = document.getElementById('elements-container');
    const allItems = container.querySelectorAll('.element-item');
    allItems.forEach(item => {
        item.classList.remove('drag-over');
    });
    container.classList.remove('drag-over');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    e.dataTransfer.dropEffect = 'move';
    
    const container = document.getElementById('elements-container');
    container.classList.add('drag-over');
    
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        const container = document.getElementById('elements-container');
        const allItems = Array.from(container.querySelectorAll('.element-item'));
        const draggedIndex = allItems.indexOf(draggedElement);
        const targetIndex = allItems.indexOf(this);
        
        if (draggedIndex < targetIndex) {
            this.parentNode.insertBefore(draggedElement, this.nextSibling);
        } else {
            this.parentNode.insertBefore(draggedElement, this);
        }
    }
    
    return false;
}

function handleFileSelect(input, elementId) {
    const file = input.files[0];
    const filenameDiv = document.getElementById(`filename-${elementId}`);
    
    if (file) {
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            showNotification('L\'image est trop grande (max 5 MB)', 'error');
            input.value = '';
            return;
        }
        
        filenameDiv.textContent = file.name;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const elementDiv = document.querySelector(`[data-id="${elementId}"]`);
            elementDiv.dataset.imageData = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        filenameDiv.textContent = 'Aucun fichier';
    }
}

function removeElement(elementId) {
    const element = document.querySelector(`[data-id="${elementId}"]`);
    if (element) {
        element.style.animation = 'slideOut 0.2s ease';
        setTimeout(() => {
            element.remove();
            
            const container = document.getElementById('elements-container');
            if (container.children.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">✨</div>
                        <p>Commencez par ajouter un élément</p>
                    </div>
                `;
            }
        }, 200);
    }
}

function clearAll() {
    if (!confirm('Voulez-vous vraiment tout effacer ?')) {
        return;
    }
    
    const container = document.getElementById('elements-container');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">✨</div>
            <p>Commencez par ajouter un élément</p>
        </div>
    `;
    showNotification('Tous les éléments ont été supprimés', 'info');
}

function showNotification(message, type = 'info') {
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : type === 'success' ? '#10b981' : '#6366f1'};
        color: white;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    @keyframes slideUp {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
    }
    @keyframes slideOut {
        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
`;
document.head.appendChild(style);

function generateImage() {
    const container = document.getElementById('elements-container');
    const elementDivs = container.querySelectorAll('.element-item');
    
    if (elementDivs.length === 0) {
        showNotification('Ajoutez au moins un élément', 'warning');
        return;
    }

    const elementsData = [];

    elementDivs.forEach(elementDiv => {
        const type = elementDiv.dataset.type;
        const input = elementDiv.querySelector('.element-input');
        
        if (type === 'title') {
            const content = input.value.trim();
            if (content) {
                elementsData.push({ type: 'title', content });
            }
        } else if (type === 'text') {
            const content = input.value.trim();
            const bold = elementDiv.querySelector('.element-bold').checked;
            if (content) {
                elementsData.push({ type: 'text', content, bold });
            }
        } else if (type === 'qrcode') {
            const content = input.value.trim();
            if (content) {
                elementsData.push({ type: 'qrcode', content });
            }
        } else if (type === 'image') {
            const imageData = elementDiv.dataset.imageData;
            if (imageData) {
                elementsData.push({ type: 'image', content: imageData });
            }
        } else if (type === 'separator') {
            elementsData.push({ type: 'separator' });
        } else if (type === 'space') {
            const height = input ? parseInt(input.value) || 30 : 30;
            elementsData.push({ type: 'space', height });
        } else if (type === 'barcode') {
            const content = input.value.trim();
            if (content) {
                elementsData.push({ type: 'barcode', content });
            }
        }
    });

    if (elementsData.length === 0) {
        showNotification('Remplissez au moins un élément', 'warning');
        return;
    }

    const generateBtn = event.target;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="icon">⏳</span> Génération...';

    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ elements: elementsData })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la génération');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated_image.png';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showNotification('✅ Image téléchargée avec succès !', 'success');
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<span class="icon">🎨</span> Générer l\'image';
    })
    .catch(error => {
        console.error('Erreur:', error);
        showNotification('❌ Erreur lors de la génération', 'error');
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<span class="icon">🎨</span> Générer l\'image';
    });
}
