let elements = [];

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

    let elementHTML = '';

    if (type === 'title') {
        elementHTML = `
            <div class="element-header">
                <span class="element-title">📌 Titre</span>
                <button class="btn-remove" onclick="removeElement(${elementId})">Supprimer</button>
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
                <span class="element-title">📄 Paragraphe</span>
                <button class="btn-remove" onclick="removeElement(${elementId})">Supprimer</button>
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
                <span class="element-title">📱 QR Code</span>
                <button class="btn-remove" onclick="removeElement(${elementId})">Supprimer</button>
            </div>
            <div class="element-content">
                <div class="input-group">
                    <label>URL ou texte pour le QR Code</label>
                    <input type="text" class="element-input" placeholder="https://exemple.com">
                </div>
            </div>
        `;
    } else if (type === 'image') {
        elementHTML = `
            <div class="element-header">
                <span class="element-title">🖼️ Image</span>
                <button class="btn-remove" onclick="removeElement(${elementId})">Supprimer</button>
            </div>
            <div class="element-content">
                <div class="input-group">
                    <label class="file-upload-btn">
                        <span class="icon">📁</span> Choisir une image
                        <input type="file" class="element-file" accept="image/*" onchange="handleFileSelect(this, ${elementId})">
                    </label>
                    <div class="file-name" id="filename-${elementId}">Aucun fichier sélectionné</div>
                </div>
            </div>
        `;
    }

    elementDiv.innerHTML = elementHTML;
    container.appendChild(elementDiv);
}

function handleFileSelect(input, elementId) {
    const file = input.files[0];
    const filenameDiv = document.getElementById(`filename-${elementId}`);
    
    if (file) {
        filenameDiv.textContent = file.name;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const elementDiv = document.querySelector(`[data-id="${elementId}"]`);
            elementDiv.dataset.imageData = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        filenameDiv.textContent = 'Aucun fichier sélectionné';
    }
}

function removeElement(elementId) {
    const element = document.querySelector(`[data-id="${elementId}"]`);
    if (element) {
        element.remove();
    }

    const container = document.getElementById('elements-container');
    if (container.children.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✨</div>
                <p>Commencez par ajouter un élément</p>
            </div>
        `;
    }
}

function clearAll() {
    const container = document.getElementById('elements-container');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">✨</div>
            <p>Commencez par ajouter un élément</p>
        </div>
    `;
}

function generateImage() {
    const container = document.getElementById('elements-container');
    const elementDivs = container.querySelectorAll('.element-item');
    
    if (elementDivs.length === 0) {
        alert('Veuillez ajouter au moins un élément avant de générer l\'image.');
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
        }
    });

    if (elementsData.length === 0) {
        alert('Veuillez remplir au moins un élément avant de générer l\'image.');
        return;
    }

    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ elements: elementsData })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la génération de l\'image');
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
        
        alert('✅ Image générée et téléchargée avec succès !');
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('❌ Erreur lors de la génération de l\'image. Veuillez réessayer.');
    });
}
