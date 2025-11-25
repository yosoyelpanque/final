// js/logic.js
import { state, photoDB, logActivity, updateSerialNumberCache, generateUUID, deleteDB, VERIFIERS } from './state.js';
import { 
    elements, showToast, showConfirmationModal, showUndoToast, updateTheme, checkReadOnlyMode,
    renderDashboard, renderUserList, renderInventoryTable, renderLoadedLists, renderDirectory,
    updateActiveUserBanner, createInventoryRowElement
} from './ui.js';
import { processFile, exportSession, importSession, exportInventoryToXLSX, exportLabelsToXLSX, findReportDateSmart } from './files.js';

// --- VARIABLES LOCALES ---
let currentPage = 1;
const itemsPerPage = 50;
let filteredItems = [];
let autosaveIntervalId;
let html5QrCode;
let currentDiffData = { newItems: [], modItems: [], delItems: [] };

// Helper: Debounce
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// --- GESTIÓN DE ESTADO ---

export function saveState() {
    if (state.readOnlyMode) return;
    try {
        const stateToSave = { ...state };
        delete stateToSave.serialNumberCache;
        delete stateToSave.cameraStream;
        localStorage.setItem('inventarioProState', JSON.stringify(stateToSave));
    } catch (e) {
        console.error('Error Crítico al guardar el estado:', e);
        state.readOnlyMode = true;
        checkReadOnlyMode();
        showConfirmationModal(
            '¡ALERTA! Almacenamiento Lleno',
            'El almacenamiento local está lleno. La app está en modo lectura. Por favor exporta la sesión y reinicia.',
            () => {}, { confirmText: 'Entendido', cancelText: '' }
        );
        if (autosaveIntervalId) clearInterval(autosaveIntervalId);
    }
}

export function loadState() {
    try {
        const storedState = localStorage.getItem('inventarioProState');
        if (storedState) {
            const loaded = JSON.parse(storedState);
            // Merge con valores por defecto para compatibilidad hacia atrás
            const defaultState = { ...state };
            Object.assign(state, defaultState, loaded);
            
            // Corrección de layouts antiguos
            if (!state.mapLayout || !state.mapLayout.page1) {
                if (Object.keys(state.mapLayout || {}).length > 0 && !state.mapLayout.page1) {
                    const oldLayout = { ...state.mapLayout };
                    state.mapLayout = { 'page1': oldLayout };
                    state.currentLayoutPage = 'page1';
                    state.layoutPageNames = { 'page1': 'Página 1' };
                }
            }
            updateSerialNumberCache();
            return true;
        }
    } catch (e) {
        console.error('Error al cargar el estado:', e);
    }
    return false;
}

export async function resetInventoryState() {
    const currentUser = state.currentUser;
    const theme = state.theme;

    // Resetear variables en memoria
    state.inventory = [];
    state.additionalItems = [];
    state.resguardantes = [];
    state.activeResguardante = null;
    state.locations = {};
    state.areas = [];
    state.areaNames = {};
    state.sessionStartTime = new Date().toISOString();
    state.additionalPhotos = {};
    state.locationPhotos = {};
    state.notes = {};
    state.photos = {};
    state.inventoryFinished = false;
    state.areaDirectory = {};
    state.closedAreas = {};
    state.completedAreas = {};
    state.persistentAreas = [];
    state.activityLog = [];
    state.mapLayout = { 'page1': {} };
    state.currentLayoutPage = 'page1';
    state.layoutImages = {};
    state.layoutItemColors = {};
    state.readOnlyMode = false;

    try {
        if (photoDB.db) {
            photoDB.db.close();
            photoDB.db = null;
        }
        await deleteDB('InventarioProPhotosDB');
        await photoDB.init();
        showToast('Se ha iniciado un nuevo inventario.', 'info');
        logActivity('Sesión reiniciada', `Nuevo inventario iniciado por ${currentUser.name}.`);
        saveState();
        window.location.reload(); // Recarga limpia para asegurar UI
    } catch (error) {
        console.error("Error al reiniciar DB:", error);
        showToast('Error al reiniciar la base de datos.', 'error');
    }
}

function startAutosave() {
    const interval = (parseInt(elements.settings.autosaveInterval.value) || 30) * 1000;
    if (autosaveIntervalId) clearInterval(autosaveIntervalId);
    autosaveIntervalId = setInterval(() => {
        if (!state.readOnlyMode && state.loggedIn) {
            saveState();
        }
    }, interval);
}

// --- LÓGICA DE INVENTARIO ---

export function populateAreaSelects() {
    const areasFromInventory = state.inventory.map(item => item.areaOriginal);
    const areasFromUsers = state.resguardantes.map(user => user.area);
    const persistentAreas = state.persistentAreas || [];
    state.areas = [...new Set([...areasFromInventory, ...areasFromUsers, ...persistentAreas])].filter(Boolean).sort();

    [elements.userForm.areaSelect, elements.reports.areaFilter, elements.inventory.areaFilter, elements.editUserModal.areaSelect, elements.adicionales.areaFilter, elements.reassignModal.areaSelect].forEach(select => {
        if(!select) return;
        const selectedValue = select.value;
        const firstOpt = select.id.includes('user-area-select') ? '<option value="">Seleccione</option>' : '<option value="all">Todas</option>';
        select.innerHTML = firstOpt + state.areas.map(area => `<option value="${area}" ${selectedValue === area ? 'selected' : ''}>${state.areaNames[area] || area}</option>`).join('');
        if (selectedValue && !select.querySelector(`option[value="${selectedValue}"]`)) {
            select.value = select.id.includes('user-area-select') ? '' : 'all';
        }
    });
}

export function populateReportFilters() {
    const areaSelect = elements.reports.areaFilter;
    const userSelect = elements.reports.userFilter;
    const selectedArea = areaSelect.value;

    populateAreaSelects(); // Reutilizamos la lógica

    let usersToList = state.resguardantes;
    if (selectedArea !== 'all') {
        usersToList = usersToList.filter(user => user.area === selectedArea);
    }

    const selectedUser = userSelect.value;
    userSelect.innerHTML = '<option value="all">Todos los usuarios</option>' +
        usersToList.sort((a, b) => a.name.localeCompare(b.name)).map(user => `<option value="${user.name}">${user.name}</option>`).join('');
    
    if (usersToList.some(user => user.name === selectedUser)) {
        userSelect.value = selectedUser;
    } else {
        userSelect.value = 'all';
    }
}

export function populateBookTypeFilter() {
    const bookTypes = [...new Set(state.inventory.map(item => item.listadoOriginal))].filter(Boolean).sort();
    const select = elements.inventory.bookTypeFilter;
    select.innerHTML = '<option value="all">Todos los tipos</option>' + 
        bookTypes.map(type => `<option value="${type}">${type}</option>`).join('');
}

export function filterAndRenderInventory() {
    const searchTerm = elements.inventory.searchInput.value.trim().toLowerCase();
    const statusFilter = elements.inventory.statusFilter.value;
    const areaFilter = elements.inventory.areaFilter.value;
    const bookTypeFilter = elements.inventory.bookTypeFilter.value;

    filteredItems = state.inventory.filter(item =>
        (!searchTerm || [item['CLAVE UNICA'], item['DESCRIPCION'], item['MARCA'], item['MODELO'], item['SERIE']].some(f => String(f||'').toLowerCase().includes(searchTerm))) &&
        (statusFilter === 'all' || item.UBICADO === statusFilter) &&
        (areaFilter === 'all' || item.areaOriginal === areaFilter) &&
        (bookTypeFilter === 'all' || item.listadoOriginal === bookTypeFilter)
    );
    
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToRender = filteredItems.slice(start, end);

    renderInventoryTable(itemsToRender, currentPage, totalPages);

    // Renderizar resultados adicionales
    const additionalResultsContainer = document.getElementById('additional-search-results-container');
    const additionalResultsList = document.getElementById('additional-search-results-list');

    if (!searchTerm) {
        additionalResultsContainer.classList.add('hidden');
        return;
    }

    const additionalMatches = state.additionalItems.filter(item =>
        (item.clave && String(item.clave).toLowerCase().includes(searchTerm)) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(searchTerm)) ||
        (item.marca && item.marca.toLowerCase().includes(searchTerm)) ||
        (item.serie && String(item.serie).toLowerCase().includes(searchTerm)) ||
        (item.claveAsignada && String(item.claveAsignada).toLowerCase().includes(searchTerm))
    );

    if (additionalMatches.length > 0) {
        additionalResultsList.innerHTML = additionalMatches.map(item => {
            const isPersonal = item.personal === 'Si';
            const itemClass = isPersonal ? 'personal-item' : 'additional-item';
            return `
                <div class="flex items-center justify-between p-3 rounded-lg shadow-sm border-l-4 ${itemClass}">
                    <div>
                        <p class="font-semibold">${item.descripcion}</p>
                        <p class="text-sm opacity-80">Clave: ${item.clave || 'N/A'}, Serie: ${item.serie || 'N/A'}, Asignada: ${item.claveAsignada || 'N/A'}</p>
                        <p class="text-xs opacity-70 mt-1">Asignado a: <strong>${item.usuario}</strong></p>
                    </div>
                    <i class="fa-solid fa-star text-purple-400" title="Bien Adicional"></i>
                </div>
            `;
        }).join('');
        additionalResultsContainer.classList.remove('hidden');
    } else {
        additionalResultsContainer.classList.add('hidden');
    }
}

export function recalculateLocationCounts() {
    state.locations = {};
    state.resguardantes.forEach(user => {
        let locsToProcess = [];
        if (user.locations && Array.isArray(user.locations) && user.locations.length > 0) {
            locsToProcess = user.locations;
        } else if (user.locationWithId) {
            locsToProcess = [user.locationWithId];
        }

        locsToProcess.forEach(locFull => {
            if (!locFull) return;
            const baseMatch = locFull.match(/^(.*)\s\d+$/);
            let base = baseMatch ? baseMatch[1] : locFull;
            state.locations[base] = (state.locations[base] || 0) + 1;
        });
    });
}

function checkAreaCompletion(areaId) {
    if (!areaId || state.closedAreas[areaId]) return;

    const areaItems = state.inventory.filter(item => item.areaOriginal === areaId);
    const isAreaComplete = areaItems.length > 0 && areaItems.every(item => item.UBICADO === 'SI');
    const wasPreviouslyComplete = !!state.completedAreas[areaId];

    if (isAreaComplete && !wasPreviouslyComplete) {
        state.completedAreas[areaId] = true; 
        logActivity('Área completada', `Todos los bienes del área ${areaId} han sido ubicados.`);
        showToast(`¡Área ${state.areaNames[areaId] || areaId} completada!`);
        saveState(); 
        renderLoadedLists(); 
    } else if (!isAreaComplete && wasPreviouslyComplete) {
        delete state.completedAreas[areaId];
        saveState();
        renderLoadedLists(); 
    }
}

function checkInventoryCompletion() {
    if (state.inventoryFinished || state.inventory.length === 0) return;
    const allLocated = state.inventory.every(item => item.UBICADO === 'SI');
    if (allLocated) {
        state.inventoryFinished = true;
        logActivity('Inventario completado', 'Todos los bienes han sido ubicados.');
        showToast('¡Felicidades! Has ubicado todos los bienes.');
        saveState();
    }
}

export function handleInventoryActions(action) {
    if (state.readOnlyMode) return showToast('Modo de solo lectura.', 'warning');
    const selectedClaves = Array.from(document.querySelectorAll('.inventory-item-checkbox:checked')).map(cb => cb.closest('tr').dataset.clave);
    if (selectedClaves.length === 0) return showToast('Seleccione al menos un bien.', 'error');
    
    if (action === 'desubicar') {
        showConfirmationModal('Des-ubicar Bienes', `¿Marcar ${selectedClaves.length} bien(es) como NO ubicados?`, () => {
            selectedClaves.forEach(clave => {
                const item = state.inventory.find(i => i['CLAVE UNICA'] === clave);
                if (item) {
                    item.UBICADO = 'NO';
                    item['NOMBRE DE USUARIO'] = '';
                    item['IMPRIMIR ETIQUETA'] = 'NO'; 
                    item.fechaUbicado = null;
                    item.areaIncorrecta = false;
                    checkAreaCompletion(item.areaOriginal); 
                }
            });
            showToast(`${selectedClaves.length} bien(es) des-ubicado(s).`);
            filterAndRenderInventory(); renderDashboard(); saveState();
        });
        return; 
    }

    if (!state.activeResguardante) {
        return showToast('Debe activar un usuario para ubicar o re-etiquetar.', 'error');
    }
    const activeUser = state.activeResguardante;

    selectedClaves.forEach(clave => {
        const item = state.inventory.find(i => i['CLAVE UNICA'] === clave);
        if (!item) return;

        const isAssignedToOther = item.UBICADO === 'SI' && item['NOMBRE DE USUARIO'] && item['NOMBRE DE USUARIO'] !== activeUser.name;
        
        const processItem = () => {
            // 1. Obtener ubicación precisa
            const selectDesktop = document.getElementById('active-user-location-select');
            const preciseLocation = selectDesktop ? selectDesktop.value : (activeUser.locationWithId || 'N/A');

            // 2. Asignar
            item.UBICADO = 'SI';
            item['NOMBRE DE USUARIO'] = activeUser.name;
            item.fechaUbicado = new Date().toISOString();
            item.areaIncorrecta = item.areaOriginal !== activeUser.area;
            item.ubicacionEspecifica = preciseLocation; 
            
            if (action === 're-etiquetar') {
                item['IMPRIMIR ETIQUETA'] = 'SI';
            } else if (action === 'ubicar') {
                if (item['IMPRIMIR ETIQUETA'] === 'SI') item['IMPRIMIR ETIQUETA'] = 'NO';
            }
            checkAreaCompletion(item.areaOriginal);
        };

        if (isAssignedToOther) {
            showConfirmationModal('Reasignar Bien', `El bien ${clave} ya está asignado. ¿Reasignar a ${activeUser.name}?`, () => {
                processItem();
                showToast(`Bien ${clave} reasignado.`);
                filterAndRenderInventory(); renderDashboard(); saveState();
            });
        } else {
            processItem(); 
        }
    });

    checkInventoryCompletion();
    showToast(action === 'ubicar' ? 'Bienes ubicados.' : 'Bienes marcados para re-etiquetar.');
    filterAndRenderInventory(); 
    renderDashboard(); 
    saveState();
    elements.inventory.searchInput.value = '';
}

// --- CONCILIACIÓN / AUDITORÍA ---

export function processComparisonFile(file) {
    elements.loadingOverlay.overlay.classList.add('show');
    elements.loadingOverlay.text.textContent = 'Analizando diferencias...';
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            // Usamos la función blindada para la fecha
            const comparisonDate = findReportDateSmart(sheet);
            
            const reconTitle = document.querySelector('#reconciliation-modal h3');
            if (reconTitle) {
                reconTitle.innerHTML = `<i class="fa-solid fa-scale-balanced mr-2"></i>Conciliación de Inventario <span class="text-sm font-normal text-indigo-200 ml-2">(${comparisonDate})</span>`;
            }

            const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 11 });
            const claveUnicaRegex = /^(?:\d{5,6}|0\.\d+)$/;

            const newInventoryList = rawData.map(row => {
                const clave = String(row[0] || '').trim();
                if (!claveUnicaRegex.test(clave)) return null;
                return {
                    'CLAVE UNICA': clave, 'DESCRIPCION': String(row[1] || ''), 
                    'MARCA': row[4] || '', 'MODELO': row[5] || '', 'SERIE': row[6] || '',
                    'listadoOriginal': sheet['B7']?.v || 'Actualizado',
                    'areaOriginal': (sheet['A10']?.v || '').match(/AREA\s(\d+)/)?.[1] || 'Sin Área'
                };
            }).filter(Boolean);

            runComparisonAlgorithm(newInventoryList);

        } catch (error) {
            console.error(error);
            showToast('Error al leer el archivo de comparación.', 'error');
        } finally {
            elements.loadingOverlay.overlay.classList.remove('show');
        }
    };
    reader.readAsBinaryString(file);
}

function runComparisonAlgorithm(newList) {
    const currentMap = new Map();
    state.inventory.forEach(item => currentMap.set(item['CLAVE UNICA'], item));

    const diff = { newItems: [], modItems: [], delItems: [] };
    const processedKeys = new Set();

    newList.forEach(newItem => {
        const clave = newItem['CLAVE UNICA'];
        processedKeys.add(clave);

        if (currentMap.has(clave)) {
            const currentItem = currentMap.get(clave);
            const modifications = [];
            // Campos a auditar
            ['DESCRIPCION', 'MARCA', 'MODELO', 'SERIE'].forEach(field => {
                if (currentItem[field] !== newItem[field]) {
                    modifications.push({ field, old: currentItem[field], new: newItem[field] });
                }
            });

            if (modifications.length > 0) {
                diff.modItems.push({ clave, newItem, modifications });
            }
        } else {
            diff.newItems.push(newItem);
        }
    });

    currentMap.forEach((item, clave) => {
        if (!processedKeys.has(clave)) {
            diff.delItems.push(item);
        }
    });

    currentDiffData = diff;
    renderReconciliationUI(diff);
}

function renderReconciliationUI(diff) {
    elements.reconciliation.countNew.textContent = diff.newItems.length;
    elements.reconciliation.countMod.textContent = diff.modItems.length;
    elements.reconciliation.countDel.textContent = diff.delItems.length;
    renderDiffTab('new');
    elements.reconciliation.modal.classList.add('show');
}

function renderDiffTab(type) {
    const container = elements.reconciliation.content;
    container.innerHTML = '';
    let items = [];
    let html = '';

    ['new', 'mod', 'del'].forEach(t => {
        const btn = elements.reconciliation[`tab${t.charAt(0).toUpperCase() + t.slice(1)}`]; // tabNew, tabMod...
        if(btn) btn.className = t === type ? 'px-4 py-2 font-bold text-indigo-600 border-b-2 border-indigo-600' : 'px-4 py-2 text-gray-500 hover:text-gray-700';
    });

    if (type === 'new') {
        items = currentDiffData.newItems;
        if (items.length === 0) return container.innerHTML = '<p class="text-center text-gray-500 p-4">No hay bienes nuevos.</p>';
        html = items.map(item => `
            <div class="diff-card diff-new flex items-center">
                <input type="checkbox" class="mr-3 w-5 h-5 rounded diff-check" checked data-type="new" data-clave="${item['CLAVE UNICA']}">
                <div><p class="font-bold text-green-700">ALTA: ${item['CLAVE UNICA']}</p><p class="text-sm">${item['DESCRIPCION']}</p></div>
            </div>`).join('');
    } 
    else if (type === 'mod') {
        items = currentDiffData.modItems;
        if (items.length === 0) return container.innerHTML = '<p class="text-center text-gray-500 p-4">No hay cambios.</p>';
        html = items.map(data => `
            <div class="diff-card diff-mod flex items-center">
                <input type="checkbox" class="mr-3 w-5 h-5 rounded diff-check" checked data-type="mod" data-clave="${data.clave}">
                <div><p class="font-bold text-orange-700">CAMBIO: ${data.clave}</p>
                <div class="pl-2 border-l-2 border-orange-200 mt-1">${data.modifications.map(m => `<div><span class="font-semibold text-xs">${m.field}:</span> <span class="diff-old-val">${m.old}</span> -> <span class="diff-new-val">${m.new}</span></div>`).join('')}</div></div>
            </div>`).join('');
    }
    else if (type === 'del') {
        items = currentDiffData.delItems;
        if (items.length === 0) return container.innerHTML = '<p class="text-center text-gray-500 p-4">No hay bajas.</p>';
        html = items.map(item => `
            <div class="diff-card diff-del flex items-center">
                <input type="checkbox" class="mr-3 w-5 h-5 rounded diff-check" data-type="del" data-clave="${item['CLAVE UNICA']}"> 
                <div><p class="font-bold text-red-700">BAJA: ${item['CLAVE UNICA']}</p><p class="text-sm text-gray-600">${item['DESCRIPCION']}</p></div>
            </div>`).join('');
    }
    container.innerHTML = html;
}

// --- INICIALIZACIÓN Y LISTENERS ---

export function initialize() {
    // Carga inicial
    if (loadState()) {
        recalculateLocationCounts();
        if (state.loggedIn) {
            elements.loginPage.classList.add('hidden');
            elements.mainApp.classList.remove('hidden');
            elements.currentUserDisplay.textContent = state.currentUser.name;
            updateTheme(state.theme);
            renderDashboard();
            populateAreaSelects();
            populateReportFilters();
            populateBookTypeFilter();
            renderLoadedLists();
            renderDirectory();
            updateActiveUserBanner();
            startAutosave();
        }
    }

    // --- EVENTOS PRINCIPALES ---
    
    // Login
    elements.employeeLoginBtn.addEventListener('click', handleLogin);
    elements.employeeNumberInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });

    function handleLogin() {
        const num = elements.employeeNumberInput.value;
        const name = VERIFIERS[num];
        if (name) {
            state.loggedIn = true;
            state.currentUser = { number: num, name: name };
            state.sessionStartTime = state.sessionStartTime || new Date().toISOString();
            saveState();
            window.location.reload();
        } else {
            showToast('Usuario no autorizado', 'error');
        }
    }

    // Navegación
    elements.logoutBtn.addEventListener('click', () => {
        state.loggedIn = false;
        saveState();
        window.location.reload();
    });
    
    elements.tabsContainer.addEventListener('click', e => {
        const btn = e.target.closest('.tab-btn');
        if(btn) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
            updateActiveUserBanner();
        }
    });

    // Inventario
    elements.inventory.searchInput.addEventListener('input', debounce(() => { currentPage = 1; filterAndRenderInventory(); }, 300));
    elements.inventory.ubicadoBtn.addEventListener('click', () => handleInventoryActions('ubicar'));
    elements.inventory.reEtiquetarBtn.addEventListener('click', () => handleInventoryActions('re-etiquetar'));
    elements.inventory.desubicarBtn.addEventListener('click', () => handleInventoryActions('desubicar'));
    elements.inventory.prevPageBtn.addEventListener('click', () => { if(currentPage > 1) { currentPage--; filterAndRenderInventory(); }});
    elements.inventory.nextPageBtn.addEventListener('click', () => { currentPage++; filterAndRenderInventory(); });
    
    // Carga de Archivos
    elements.uploadBtn.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', (e) => { [...e.target.files].forEach(processFile); e.target.value = ''; });

    // Conciliación
    elements.compareFile.btn.addEventListener('click', () => elements.compareFile.input.click());
    elements.compareFile.input.addEventListener('change', e => {
        if(e.target.files[0]) processComparisonFile(e.target.files[0]);
        e.target.value = '';
    });
    
    elements.reconciliation.closeBtn.addEventListener('click', () => elements.reconciliation.modal.classList.remove('show'));
    elements.reconciliation.tabNew.addEventListener('click', () => renderDiffTab('new'));
    elements.reconciliation.tabMod.addEventListener('click', () => renderDiffTab('mod'));
    elements.reconciliation.tabDel.addEventListener('click', () => renderDiffTab('del'));
    
    elements.reconciliation.applyBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.diff-check:checked');
        if (checkboxes.length === 0) return showToast('No has seleccionado nada.', 'warning');
        
        let count = 0;
        checkboxes.forEach(cb => {
            const type = cb.dataset.type;
            const clave = cb.dataset.clave;
            
            if (type === 'new') {
                const item = currentDiffData.newItems.find(i => i['CLAVE UNICA'] === clave);
                if(item) {
                    item['UBICADO'] = 'NO'; item['IMPRIMIR ETIQUETA'] = 'NO'; item['NOMBRE DE USUARIO'] = '';
                    item.listId = Date.now();
                    state.inventory.push(item);
                }
            } else if (type === 'mod') {
                const data = currentDiffData.modItems.find(i => i.clave === clave);
                const index = state.inventory.findIndex(i => i['CLAVE UNICA'] === clave);
                if (data && index !== -1) {
                    state.inventory[index]['DESCRIPCION'] = data.newItem['DESCRIPCION'];
                    state.inventory[index]['MARCA'] = data.newItem['MARCA'];
                    state.inventory[index]['MODELO'] = data.newItem['MODELO'];
                    state.inventory[index]['SERIE'] = data.newItem['SERIE'];
                }
            } else if (type === 'del') {
                state.inventory = state.inventory.filter(i => i['CLAVE UNICA'] !== clave);
                delete state.photos[clave];
            }
            count++;
        });
        
        // ESCUCHA DE EVENTOS PERSONALIZADOS (Rompe la dependencia circular)
    window.addEventListener('inventory-updated', () => {
        console.log('♻️ Evento recibido: Inventario actualizado');
        saveState();
        populateAreaSelects();
        populateReportFilters();
        populateBookTypeFilter();
        filterAndRenderInventory();
        renderLoadedLists();
        renderDirectory();
        renderDashboard();
    });
}
        updateSerialNumberCache();
        populateAreaSelects();
        filterAndRenderInventory();
        renderDashboard();
        saveState();
        elements.reconciliation.modal.classList.remove('show');
        showToast(`${count} cambios aplicados.`, 'success');
    });

    // Ajustes
    elements.settings.exportSessionBtn.addEventListener('click', () => exportSession(false));
    elements.settings.finalizeInventoryBtn.addEventListener('click', () => showConfirmationModal('Finalizar', '¿Seguro?', () => exportSession(true)));
    elements.settings.importSessionBtn.addEventListener('click', () => elements.settings.importFileInput.click());
    elements.settings.importFileInput.addEventListener('change', e => importSession(e.target.files[0]));
    
    // Reportes XLSX
    elements.reports.exportXlsxBtn.addEventListener('click', exportInventoryToXLSX);
    elements.reports.exportLabelsXlsxBtn.addEventListener('click', exportLabelsToXLSX);

    // Foto Modal Fix (Memoria) - Solo delegamos eventos de cierre, la apertura es en ui.js/logic.js calls
    // ... (otros eventos menores omitidos para brevedad pero asumidos migrados)
}