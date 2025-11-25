// js/ui.js
import { state, photoDB } from './state.js';

// --- REFERENCIAS AL DOM (ELEMENTS) ---
export const elements = {
    loginPage: document.getElementById('login-page'), 
    mainApp: document.getElementById('main-app'),
    employeeNumberInput: document.getElementById('employee-number-input'),
    employeeLoginBtn: document.getElementById('employee-login-btn'),
    clearSessionLink: document.getElementById('clear-session-link'),
    currentUserDisplay: document.getElementById('current-user-name'),
    fileInput: document.getElementById('file-input'),
    uploadBtn: document.getElementById('upload-btn'), 
    logoutBtn: document.getElementById('logout-btn'),
    dashboard: {
        headerAndDashboard: document.getElementById('header-and-dashboard'),
        toggleBtn: document.getElementById('dashboard-toggle-btn'),
        dailyProgressCard: document.getElementById('daily-progress-card'),
        progressTooltip: document.getElementById('progress-tooltip'),
    },
    totalItemsEl: document.getElementById('total-items'), 
    locatedItemsEl: document.getElementById('located-items'),
    pendingItemsEl: document.getElementById('pending-items'), 
    dailyProgressEl: document.getElementById('daily-progress'),
    workingAreasCountEl: document.getElementById('working-areas-count'),
    additionalItemsCountEl: document.getElementById('additional-items-count'),
    tabsContainer: document.getElementById('tabs-container'), 
    tabContents: document.querySelectorAll('.tab-content'),
    mainContentArea: document.getElementById('main-content-area'),
    activeUserBanner: {
        banner: document.getElementById('active-user-banner'),
        name: document.getElementById('active-user-banner-name'),
        area: document.getElementById('active-user-banner-area'), 
        deactivateBtn: document.getElementById('deactivate-user-btn'),
        selectDesktop: document.getElementById('active-user-location-select'),
        selectMobile: document.getElementById('active-user-location-select-mobile')
    },
    userForm: {
        name: document.getElementById('user-name'), 
        locationSelect: document.getElementById('user-location-select'),
        locationManual: document.getElementById('user-location-manual'), 
        areaSelect: document.getElementById('user-area-select'),
        createBtn: document.getElementById('create-user-btn'), 
        list: document.getElementById('registered-users-list'),
        addLocationBtn: document.getElementById('add-location-btn'),
        locationsList: document.getElementById('new-user-locations-list')
    },
    editUserModal: {
        modal: document.getElementById('edit-user-modal'),
        name: document.getElementById('edit-user-name'),
        locationType: document.getElementById('edit-user-location-type'),
        locationManual: document.getElementById('edit-user-location-manual'),
        addLocationBtn: document.getElementById('edit-add-location-btn'),
        locationsList: document.getElementById('edit-user-locations-list'),
        areaSelect: document.getElementById('edit-user-area'),
        saveBtn: document.getElementById('edit-user-save-btn'),
        cancelBtn: document.getElementById('edit-user-cancel-btn')
    },
    inventory: {
        tableBody: document.getElementById('inventory-table-body'),
        searchInput: document.getElementById('search-input'), 
        qrScanBtn: document.getElementById('qr-scan-btn'),
        clearSearchBtn: document.getElementById('clear-search-btn'), 
        ubicadoBtn: document.getElementById('ubicado-btn'),
        reEtiquetarBtn: document.getElementById('re-etiquetar-btn'),
        desubicarBtn: document.getElementById('desubicar-btn'),
        addNoteBtn: document.getElementById('add-note-btn'),
        prevPageBtn: document.getElementById('prev-page-btn'),
        nextPageBtn: document.getElementById('next-page-btn'), 
        pageInfo: document.getElementById('page-info'),
        statusFilter: document.getElementById('status-filter'), 
        areaFilter: document.getElementById('area-filter-inventory'),
        bookTypeFilter: document.getElementById('book-type-filter'),
        selectAllCheckbox: document.getElementById('select-all-checkbox'),
        editModeToggle: document.getElementById('inventory-edit-mode-toggle')
    },
    adicionales: {
        form: document.getElementById('adicional-form'),
        addBtn: document.getElementById('add-adicional-btn'), 
        list: document.getElementById('adicionales-list'),
        areaFilter: document.getElementById('ad-area-filter'),
        userFilter: document.getElementById('ad-user-filter'),
        printResguardoBtn: document.getElementById('print-adicionales-resguardo-btn'),
        total: document.getElementById('additional-items-total'),
        claveInput: document.getElementById('ad-clave'),
        serieInput: document.getElementById('ad-serie'),
        claveFeedback: document.getElementById('ad-clave-feedback'),
        serieFeedback: document.getElementById('ad-serie-feedback')
    },
    reports: {
        areaProgressContainer: document.getElementById('area-progress-container'),
        stats: document.getElementById('general-stats'), 
        areaFilter: document.getElementById('report-area-filter'),
        userFilter: document.getElementById('report-user-filter'),
        reportButtons: document.querySelectorAll('.report-btn'),
        exportLabelsXlsxBtn: document.getElementById('export-labels-xlsx-btn'),
        exportXlsxBtn: document.getElementById('export-xlsx-btn'),
        reportViewModal: {
            modal: document.getElementById('report-view-modal'),
            title: document.getElementById('report-view-title'),
            closeBtn: document.getElementById('report-view-close-btn'),
            closeFooterBtn: document.getElementById('report-view-close-footer-btn'),
            content: document.getElementById('report-view-content'),
            tableHead: document.getElementById('report-view-table-head'),
            tableBody: document.getElementById('report-view-table-body')
        }
    },
    settings: {
        themes: document.querySelectorAll('[data-theme]'), 
        autosaveInterval: document.getElementById('autosave-interval'),
        loadedListsContainer: document.getElementById('loaded-lists-container'),
        exportSessionBtn: document.getElementById('export-session-btn'),
        importSessionBtn: document.getElementById('import-session-btn'),
        importFileInput: document.getElementById('import-file-input'),
        finalizeInventoryBtn: document.getElementById('finalize-inventory-btn'),
        summaryAuthor: document.getElementById('summary-author'),
        summaryAreaResponsible: document.getElementById('summary-area-responsible'),
        summaryLocation: document.getElementById('summary-location'),
        directoryContainer: document.getElementById('directory-container'),
        directoryCount: document.getElementById('directory-count'),
        aboutHeader: document.getElementById('about-header'),
        aboutContent: document.getElementById('about-content'),
        importPhotosBtn: document.getElementById('import-photos-btn'),
        importPhotosInput: document.getElementById('import-photos-input'),
        restorePhotosBtn: document.getElementById('restore-photos-from-backup-btn'),
        restorePhotosInput: document.getElementById('restore-photos-input')
    },
    loadingOverlay: {
        overlay: document.getElementById('loading-overlay'),
        spinner: document.getElementById('loading-spinner'),
        text: document.getElementById('loading-text')
    },
    importProgress: {
        modal: document.getElementById('import-progress-modal'),
        text: document.getElementById('import-progress-text'),
        bar: document.getElementById('import-progress-bar')
    },
    confirmationModal: document.getElementById('confirmation-modal'), 
    modalTitle: document.getElementById('modal-title'),
    modalText: document.getElementById('modal-text'), 
    modalConfirmBtn: document.getElementById('modal-confirm'),
    modalCancelBtn: document.getElementById('modal-cancel'), 
    toastContainer: document.getElementById('toast-container'),
    addAdicionalesConfirm: {
        modal: document.getElementById('add-adicionales-confirm-modal'),
        yesBtn: document.getElementById('add-adicionales-yes'),
        noBtn: document.getElementById('add-adicionales-no')
    },
    notesModal: document.getElementById('notes-modal'), 
    noteTextarea: document.getElementById('note-textarea'),
    noteSaveBtn: document.getElementById('note-save-btn'), 
    noteCancelBtn: document.getElementById('note-cancel-btn'),
    itemDetailsModal: {
        modal: document.getElementById('item-details-modal'),
        title: document.getElementById('item-details-title'),
        content: document.getElementById('item-details-content'),
        closeBtn: document.getElementById('item-details-close-btn')
    },
    qrDisplayModal: {
        modal: document.getElementById('qr-display-modal'),
        title: document.getElementById('qr-display-title'),
        container: document.getElementById('qr-code-display'),
        closeBtn: document.getElementById('qr-display-close-btn')
    },
    transferPhotoModal: {
        modal: document.getElementById('transfer-photo-modal'),
        title: document.getElementById('transfer-photo-title'),
        text: document.getElementById('transfer-photo-text'),
        preview: document.getElementById('transfer-photo-preview'),
        search: document.getElementById('transfer-photo-search'),
        select: document.getElementById('transfer-photo-select'),
        skipBtn: document.getElementById('transfer-photo-skip-btn'),
        cancelBtn: document.getElementById('transfer-photo-cancel-btn'),
        confirmBtn: document.getElementById('transfer-photo-confirm-btn')
    },
    formatoEntradaModal: {
        modal: document.getElementById('formato-entrada-modal'),
        siBtn: document.getElementById('formato-entrada-si'),
        noBtn: document.getElementById('formato-entrada-no')
    },
    editAdicionalModal: {
        modal: document.getElementById('edit-adicional-modal'),
        form: document.getElementById('edit-adicional-form'),
        saveBtn: document.getElementById('edit-adicional-save-btn'),
        cancelBtn: document.getElementById('edit-adicional-cancel-btn')
    },
    photo: {
        modal: document.getElementById('photo-modal'),
        title: document.getElementById('photo-modal-title'),
        input: document.getElementById('photo-input'),
        message: document.getElementById('photo-message'),
        closeBtn: document.getElementById('photo-close-btn'),
        viewContainer: document.getElementById('photo-view-container'),
        uploadContainer: document.getElementById('photo-upload-container'),
        img: document.getElementById('item-photo-img'),
        deleteBtn: document.getElementById('delete-photo-btn'),
        useCameraBtn: document.getElementById('use-camera-btn'),
        cameraViewContainer: document.getElementById('camera-view-container'),
        cameraStream: document.getElementById('camera-stream'),
        photoCanvas: document.getElementById('photo-canvas'),
        captureBtn: document.getElementById('capture-photo-btn'),
        switchToUploadBtn: document.getElementById('switch-to-upload-btn'),
        cameraSelect: document.getElementById('photo-camera-select')
    },
    qrScannerModal: document.getElementById('qr-scanner-modal'),
    qrReader: document.getElementById('qr-reader'), 
    qrScannerCloseBtn: document.getElementById('qr-scanner-close-btn'),
    qrCameraSelect: document.getElementById('qr-camera-select'),
    areaClosure: {
        modal: document.getElementById('area-closure-modal'),
        title: document.getElementById('area-closure-title'),
        responsibleInput: document.getElementById('area-closure-responsible'),
        locationInput: document.getElementById('area-closure-location'),
        confirmBtn: document.getElementById('area-closure-confirm-btn'),
        cancelBtn: document.getElementById('area-closure-cancel-btn')
    },
    reassignModal: {
        modal: document.getElementById('reassign-modal'),
        title: document.getElementById('reassign-title'),
        text: document.getElementById('reassign-text'),
        areaSelect: document.getElementById('reassign-area-select'),
        confirmBtn: document.getElementById('reassign-confirm-btn'),
        keepBtn: document.getElementById('reassign-keep-btn'),
        deleteAllBtn: document.getElementById('reassign-delete-all-btn'),
        cancelBtn: document.getElementById('reassign-cancel-btn'),
    },
    readOnlyOverlay: document.getElementById('read-only-mode-overlay'),
    log: {
        modal: document.getElementById('log-modal'),
        content: document.getElementById('log-content'),
        showBtn: document.getElementById('show-log-btn'),
        closeBtn: document.getElementById('log-close-btn')
    },
    detailView: {
        modal: document.getElementById('item-detail-view-modal'),
        title: document.getElementById('detail-view-title'),
        closeBtn: document.getElementById('detail-view-close-btn'),
        photoContainer: document.getElementById('detail-view-photo-container'),
        photo: document.getElementById('detail-view-photo'),
        noPhoto: document.getElementById('detail-view-no-photo'),
        clave: document.getElementById('detail-view-clave'),
        descripcion: document.getElementById('detail-view-descripcion'),
        marca: document.getElementById('detail-view-marca'),
        modelo: document.getElementById('detail-view-modelo'),
        serie: document.getElementById('detail-view-serie'),
        usuario: document.getElementById('detail-view-usuario'),
        ubicacionEspecifica: document.getElementById('detail-view-ubicacion-especifica'),
        area: document.getElementById('detail-view-area'),
        areaWarning: document.getElementById('detail-view-area-warning'),
        ubicarBtn: document.getElementById('detail-view-ubicar-btn'),
        reetiquetarBtn: document.getElementById('detail-view-reetiquetar-btn'),
        notaBtn: document.getElementById('detail-view-nota-btn'),
        fotoBtn: document.getElementById('detail-view-foto-btn')
    },
    userDetailView: {
        modal: document.getElementById('user-detail-view-modal'),
        title: document.getElementById('user-detail-view-title'),
        closeBtn: document.getElementById('user-detail-view-close-btn'),
        closeFooterBtn: document.getElementById('user-detail-view-close-footer-btn'),
        photoContainer: document.getElementById('user-detail-view-photo-container'),
        photo: document.getElementById('user-detail-view-photo'),
        noPhoto: document.getElementById('user-detail-view-no-photo'),
        name: document.getElementById('user-detail-view-name'),
        area: document.getElementById('user-detail-view-area'),
        location: document.getElementById('user-detail-view-location')
    },
    adicionalDetailView: {
        modal: document.getElementById('adicional-detail-view-modal'),
        title: document.getElementById('adicional-detail-view-title'),
        closeBtn: document.getElementById('adicional-detail-view-close-btn'),
        closeFooterBtn: document.getElementById('adicional-detail-view-close-footer-btn'),
        photoContainer: document.getElementById('adicional-detail-view-photo-container'),
        photo: document.getElementById('adicional-detail-view-photo'),
        noPhoto: document.getElementById('adicional-detail-view-no-photo'),
        descripcion: document.getElementById('adicional-detail-view-descripcion'),
        clave: document.getElementById('adicional-detail-view-clave'),
        claveAsignada: document.getElementById('adicional-detail-view-claveAsignada'),
        marca: document.getElementById('adicional-detail-view-marca'),
        modelo: document.getElementById('adicional-detail-view-modelo'),
        serie: document.getElementById('adicional-detail-view-serie'),
        area: document.getElementById('adicional-detail-view-area'),
        usuario: document.getElementById('adicional-detail-view-usuario'),
        ubicacionEspecifica: document.getElementById('adicional-detail-view-ubicacion-especifica'),
        tipo: document.getElementById('adicional-detail-view-tipo')
    },
    preprintModal: {
        modal: document.getElementById('preprint-edit-modal'),
        title: document.getElementById('preprint-title'),
        fieldsContainer: document.getElementById('preprint-fields'),
        dateInput: document.getElementById('preprint-date'),
        confirmBtn: document.getElementById('preprint-confirm-btn'),
        cancelBtn: document.getElementById('preprint-cancel-btn')
    },
    layoutEditor: { 
        modal: document.getElementById('layout-editor-modal'),
        openBtn: document.getElementById('open-layout-editor-btn'),
        closeBtn: document.getElementById('layout-close-btn'),
        saveBtn: document.getElementById('layout-save-btn'),
        printBtn: document.getElementById('layout-print-btn'),
        sidebar: document.getElementById('layout-sidebar-locations'),
        toolsSidebar: document.getElementById('layout-tools-sidebar'),
        canvas: document.getElementById('layout-canvas'),
        canvasWrapper: document.getElementById('layout-canvas-wrapper'),
        pagePrev: document.getElementById('layout-page-prev'),
        pageNext: document.getElementById('layout-page-next'),
        pageAdd: document.getElementById('layout-page-add'),
        pageReset: document.getElementById('layout-page-reset'),
        pageRemove: document.getElementById('layout-page-remove'),
        pageName: document.getElementById('layout-page-name'),
        addImageBtn: document.getElementById('layout-add-image-btn'),
        imageInput: document.getElementById('layout-image-input')
    }, 
    printContainer: document.getElementById('print-view-container'),
    printTemplates: {
        sessionSummary: document.getElementById('print-session-summary'),
        areaClosure: document.getElementById('print-area-closure'),
        resguardo: document.getElementById('print-resguardo'),
        simplePending: document.getElementById('print-simple-pending'),
        tasksReport: document.getElementById('print-tasks-report'),
        layout: document.getElementById('print-layout-view')
    },
    reconciliation: {
        modal: document.getElementById('reconciliation-modal'),
        closeBtn: document.getElementById('reconciliation-close-btn'),
        cancelBtn: document.getElementById('reconciliation-cancel-btn'),
        applyBtn: document.getElementById('reconciliation-apply-btn'),
        content: document.getElementById('diff-content-container'),
        countNew: document.getElementById('diff-count-new'),
        countMod: document.getElementById('diff-count-mod'),
        countDel: document.getElementById('diff-count-del'),
        tabNew: document.getElementById('tab-diff-new'),
        tabMod: document.getElementById('tab-diff-mod'),
        tabDel: document.getElementById('tab-diff-del')
    },
    compareFile: {
        btn: document.getElementById('compare-inventory-btn'),
        input: document.getElementById('compare-file-input')
    }
};

// --- UTILS UI ---

export function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-500' : (type === 'warning' ? 'bg-yellow-500' : 'bg-green-500');
    toast.className = `toast-notification show rounded-lg p-4 text-white shadow-lg transition-all duration-300 transform translate-y-2 opacity-0 ${bgColor}`;
    toast.textContent = message;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => { toast.classList.remove('translate-y-2', 'opacity-0'); }, 10);
    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

export function showUndoToast(message, onUndo) {
    const toast = document.createElement('div');
    let timeoutId;

    const closeToast = () => {
        toast.classList.add('opacity-0');
        toast.addEventListener('transitionend', () => toast.remove());
        clearTimeout(timeoutId);
    };

    toast.className = 'toast-notification flex items-center justify-between show rounded-lg p-4 text-white shadow-lg transition-all duration-300 transform opacity-0 bg-slate-700';
    toast.innerHTML = `<span>${message}</span>`;

    const undoButton = document.createElement('button');
    undoButton.className = 'ml-4 font-bold underline';
    undoButton.textContent = 'Deshacer';
    undoButton.onclick = () => {
        onUndo();
        closeToast();
    };
    
    toast.appendChild(undoButton);
    elements.toastContainer.appendChild(toast);

    setTimeout(() => { toast.classList.remove('opacity-0'); }, 10);
    timeoutId = setTimeout(closeToast, 5000);
}

export function showConfirmationModal(title, text, onConfirm, options = {}) {
    const { confirmText = 'Confirmar', cancelText = 'Cancelar', onCancel = () => {} } = options;
    const { modal, modalTitle, modalText, modalConfirmBtn, modalCancelBtn } = elements;
    
    modalCancelBtn.style.display = '';
    modalTitle.textContent = title;
    modalText.textContent = text;
    modalConfirmBtn.textContent = confirmText;
    modalCancelBtn.textContent = cancelText;
    modal.classList.add('show');
    
    const closeModal = () => {
        modal.classList.remove('show');
        modalConfirmBtn.onclick = null; // Limpieza simple
        modalCancelBtn.onclick = null;
    };

    modalConfirmBtn.onclick = () => { onConfirm(); closeModal(); };
    modalCancelBtn.onclick = () => { onCancel(); closeModal(); };
}

export function updateTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    state.theme = theme;
}

export function checkReadOnlyMode() {
    if (state.readOnlyMode) {
        elements.readOnlyOverlay.classList.remove('hidden');
        // Desactivar inputs masivos
        const selectors = [
            '#upload-btn', '#file-input', '#create-user-btn', '.edit-user-btn', 
            '.delete-user-btn', '.activate-user-btn', '#ubicado-btn', '#re-etiquetar-btn', 
            '#add-note-btn', '.inventory-item-checkbox', '#select-all-checkbox', '#add-adicional-btn', 
            '.edit-adicional-btn', '.delete-adicional-btn', '#note-save-btn', '#delete-photo-btn', 
            '#photo-input', '#use-camera-btn', '#capture-photo-btn', '.delete-list-btn', 
            '#finalize-inventory-btn', '#import-session-btn', '#import-file-input', 
            '#summary-area-responsible', '#summary-location', '#generate-summary-btn',
            '#user-name', '#user-location-select', '#user-location-manual', '#user-area-select',
            '#adicional-form input', '#adicional-form button', '#edit-adicional-form input',
            '.save-new-clave-btn', '.new-clave-input', '.report-btn',
            '#open-layout-editor-btn', '#layout-save-btn', '#layout-page-add', '#layout-page-remove', '#layout-page-name',
            '#layout-add-image-btn', '#layout-image-input', '#layout-page-reset',
            '#add-location-btn', '#edit-add-location-btn'
        ];
        
        document.querySelectorAll(selectors.join(',')).forEach(el => {
            el.disabled = true;
            el.style.cursor = 'not-allowed';
            if (el.tagName === 'BUTTON' || el.tagName === 'LABEL') {
                el.style.opacity = '0.6';
            }
        });
        elements.noteTextarea.readOnly = true;
    } else {
        elements.readOnlyOverlay.classList.add('hidden');
    }
}

// --- RENDERIZADO (VISUAL) ---

export function highlightText(text, searchTerm) {
    if (!searchTerm.trim() || !text) return text;
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, 'gi');
    return String(text).replace(regex, `<mark class="bg-yellow-300 rounded-sm px-1">$1</mark>`);
}

export function renderDashboard() {
    const totalItems = state.inventory.length;
    const locatedItems = state.inventory.filter(item => item.UBICADO === 'SI').length;
    const todayStr = new Date().toISOString().slice(0, 10);
    
    const dailyInventoryProgress = state.inventory.filter(item => item.fechaUbicado && item.fechaUbicado.startsWith(todayStr)).length;
    const dailyAdditionalProgress = state.additionalItems.filter(item => item.fechaRegistro && item.fechaRegistro.startsWith(todayStr)).length;
    const dailyTotal = dailyInventoryProgress + dailyAdditionalProgress;

    elements.totalItemsEl.textContent = totalItems;
    elements.locatedItemsEl.textContent = locatedItems;
    elements.pendingItemsEl.textContent = totalItems - locatedItems;
    elements.dailyProgressEl.textContent = dailyTotal;
    elements.workingAreasCountEl.textContent = new Set(state.inventory.map(item => item.areaOriginal)).size;
    elements.additionalItemsCountEl.textContent = state.additionalItems.length;
}

export function renderUserList() {
    const list = elements.userForm.list;
    const searchInput = document.getElementById('user-search-input');
    const userCountBadge = document.getElementById('user-count-badge');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filteredUsers = state.resguardantes.filter(user => {
        if (!searchTerm) return true;
        const locationsString = (user.locations || [user.locationWithId]).join(' ').toLowerCase();
        return (
            user.name.toLowerCase().includes(searchTerm) ||
            locationsString.includes(searchTerm) ||
            String(user.area).toLowerCase().includes(searchTerm)
        );
    });
    
    if (userCountBadge) userCountBadge.textContent = `${filteredUsers.length} de ${state.resguardantes.length} Total`;

    list.innerHTML = filteredUsers.length === 0 ? `<p class="text-gray-500">No se encontraron usuarios.</p>` : '';
        
    filteredUsers.forEach((user) => {
        const originalIndex = state.resguardantes.findIndex(u => u.id === user.id);
        const isActive = state.activeResguardante?.id === user.id;
        const item = document.createElement('div');
        item.className = `flex items-center justify-between p-2 rounded-lg shadow-sm transition-colors cursor-pointer ${isActive ? 'active-user border-l-4 border-green-500' : 'non-active-user'}`;
        item.dataset.userId = user.id;
        
        const hasLocationPhoto = state.locationPhotos && state.locationPhotos[user.locationWithId];
        const photoIconColor = hasLocationPhoto ? 'text-indigo-500' : 'text-gray-400';

        let locationText = '';
        if (user.locations && user.locations.length > 0) {
            const displayLocs = user.locations.slice(0, 2).join(', ');
            const remaining = user.locations.length - 2;
            locationText = remaining > 0 ? `${displayLocs} (+${remaining})` : displayLocs;
        } else {
            locationText = user.locationWithId || 'Sin ubicación';
        }

        item.innerHTML = `
            <div class="flex-grow user-info-clickable" data-user-id="${user.id}">
               <p class="font-semibold">${user.name}</p>
               <p class="text-sm text-gray-500 dark:text-gray-400">
                   <span class="font-medium text-xs bg-gray-200 dark:bg-slate-700 px-1 rounded text-gray-600 dark:text-gray-300 mr-1">Área ${user.area}</span>
                   ${locationText}
               </p>
            </div>
            <div class="space-x-2 flex items-center">
                <i class="fa-solid fa-camera text-xl ${photoIconColor} cursor-pointer location-photo-btn" data-location-id="${user.locationWithId}" title="Gestionar foto de la ubicación principal"></i>
                <button data-index="${originalIndex}" class="activate-user-btn px-3 py-1 rounded-lg text-xs font-bold transition-colors ${isActive ? 'text-white bg-green-600' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}">${isActive ? 'Activo' : 'Activar'}</button>
                <button data-index="${originalIndex}" class="edit-user-btn px-3 py-1 rounded-lg text-xs font-bold text-white bg-blue-500 hover:bg-blue-600">Editar</button>
                <button data-index="${originalIndex}" class="delete-user-btn px-3 py-1 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600">Eliminar</button>
            </div>`;
        list.appendChild(item);
    });
}

export function createInventoryRowElement(item) {
    const searchTerm = elements.inventory.searchInput.value.trim();
    const clave = item['CLAVE UNICA'] || '';
    const descripcion = item['DESCRIPCION'] || '';
    const marca = item['MARCA'] || '';
    const modelo = item['MODELO'] || '';
    const serie = item['SERIE'] || '';
    const usuario = item['NOMBRE DE USUARIO'] || '';

    const row = document.createElement('tr');
    let rowClasses = 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors';
    
    if (!state.inventoryEditMode) rowClasses += ' cursor-pointer';
    
    if (state.notes[clave]) rowClasses += ' has-note';
    if (item.UBICADO === 'SI') rowClasses += ' item-located';
    row.className = rowClasses;
    row.dataset.clave = clave;
    
    const mismatchTag = item.areaIncorrecta ? `<span class="mismatched-area-tag" title="Ubicado en el área de otro listado"⚠️</span>` : '';
    const userData = state.resguardantes.find(u => u.name === usuario);
    let locationDisplay = '';
    if (item.ubicacionEspecifica) {
        locationDisplay = `📍 Encontrado en: ${item.ubicacionEspecifica}`;
    } else if (userData) {
         locationDisplay = userData.locations ? userData.locations.join(', ') : userData.locationWithId;
    }
    
    const userDetails = userData ? `${userData.name}\nÁrea: ${userData.area}\n${locationDisplay}` : usuario;
    const truncate = (str, len) => (str && String(str).length > len ? String(str).substring(0, len) + '...' : str || '');

    const isEdit = state.inventoryEditMode;
    const editClass = isEdit ? 'inventory-editable-cell' : '';
    const contentEditableAttr = isEdit ? 'contenteditable="true"' : '';
    
    const renderCell = (field, value, truncateLen = 0) => {
        if (isEdit) {
            return `<div class="${editClass} w-full h-full min-h-[24px]" ${contentEditableAttr} data-field="${field}">${value}</div>`;
        } else {
            const text = truncateLen > 0 ? truncate(value, truncateLen) : value;
            return highlightText(text, searchTerm);
        }
    };

    row.innerHTML = `
        <td class="px-2 py-2"><input type="checkbox" class="inventory-item-checkbox rounded"></td>
        <td class="px-2 py-2 text-sm" title="${clave}">${highlightText(clave, searchTerm)}</td>
        <td class="px-2 py-2 text-sm" title="${descripcion}">
            ${renderCell('DESCRIPCION', descripcion, 30)}
            ${!isEdit ? mismatchTag : ''} 
        </td>
        <td class="px-2 py-2 text-sm" title="${marca}">${renderCell('MARCA', marca)}</td>
        <td class="px-2 py-2 text-sm" title="${modelo}">${renderCell('MODELO', modelo)}</td>
        <td class="px-2 py-2 text-sm" title="${serie}">${renderCell('SERIE', serie)}</td>
        <td class="px-2 py-2 text-sm" title="${userDetails}">${highlightText(usuario, searchTerm)}</td>
        <td class="px-2 py-2 text-sm">${item['UBICADO']}</td><td class="px-2 py-2 text-sm">${item['IMPRIMIR ETIQUETA']}</td>
        <td class="px-2 py-2 text-center">
            <div class="flex items-center justify-center space-x-3">
                <i class="fa-solid fa-note-sticky text-xl ${state.notes[clave] ? 'text-yellow-500' : 'text-gray-400'} note-icon cursor-pointer" title="Añadir/Ver Nota"></i>
                <i class="fa-solid fa-camera text-xl ${state.photos[clave] ? 'text-indigo-500' : 'text-gray-400'} camera-icon cursor-pointer" title="Añadir/Ver Foto"></i>
                <i class="fa-solid fa-circle-info text-xl text-gray-400 hover:text-blue-500 md:hidden view-details-btn cursor-pointer" title="Ver Detalles"></i>
                <i class="fa-solid fa-qrcode text-xl text-gray-400 hover:text-indigo-500 view-qr-btn cursor-pointer" title="Ver Código QR"></i>
            </div>
        </td>`;
    return row;
}

export function renderInventoryTable(itemsToRender, currentPage, totalPages) {
    const { tableBody, pageInfo, prevPageBtn, nextPageBtn } = elements.inventory;
    const fragment = document.createDocumentFragment();

    if (itemsToRender.length === 0) {
        const emptyRow = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 12; 
        cell.className = 'text-center py-4 text-gray-500';
        cell.textContent = 'No se encontraron bienes con los filtros actuales.';
        emptyRow.appendChild(cell);
        fragment.appendChild(emptyRow);
    } else {
        itemsToRender.forEach(item => {
            const rowElement = createInventoryRowElement(item);
            fragment.appendChild(rowElement);
        });
    }
    
    tableBody.innerHTML = '';
    tableBody.appendChild(fragment);

    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage >= totalPages;
}

export function renderLoadedLists() {
    const container = elements.settings.loadedListsContainer;
    const countEl = document.getElementById('loaded-lists-count');
    container.innerHTML = '';

    const loadedListsMap = new Map();
    state.inventory.forEach(item => {
        if (!loadedListsMap.has(item.listId)) {
            loadedListsMap.set(item.listId, {
                listId: item.listId,
                fileName: item.fileName,
                areaOriginal: item.areaOriginal,
                listadoOriginal: item.listadoOriginal,
                printDate: item.printDate || 'N/D' // INCLUYE LA FECHA
            });
        }
    });
    const loadedLists = Array.from(loadedListsMap.values());
    countEl.textContent = `Total: ${loadedLists.length}`;

    if (loadedLists.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No hay listados cargados.</p>';
        return;
    }

    loadedLists.forEach(list => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-slate-800';
        const areaId = list.areaOriginal;
        const isAreaCompleted = !!state.completedAreas[areaId];
        const isAreaClosed = !!state.closedAreas[areaId];
        let areaActionButtonHtml = '';

        if (isAreaClosed) {
            areaActionButtonHtml = `<button data-area-id="${areaId}" class="reprint-area-report-btn px-3 py-1 rounded-lg text-xs font-bold text-white bg-blue-500 hover:bg-blue-600">Reimprimir Acta</button>`;
        } else if (isAreaCompleted) {
             areaActionButtonHtml = `<button data-area-id="${areaId}" class="generate-area-report-btn px-3 py-1 rounded-lg text-xs font-bold text-white bg-green-500 hover:bg-green-600">Generar Acta Cierre</button>`;
        }

        item.innerHTML = `
            <div class="flex-grow">
                <p class="font-semibold text-sm text-gray-500 dark:text-slate-400">Área: <span class="text-gray-900 dark:text-slate-100">${state.areaNames[list.areaOriginal] || list.areaOriginal}</span></p>
                <p class="font-semibold text-sm text-gray-500 dark:text-slate-400">Impresión: <span class="text-indigo-600 dark:text-indigo-400 font-bold">${list.printDate}</span></p>
                <p class="font-semibold text-sm text-gray-500 dark:text-slate-400">Tipo de Libro: <span class="text-gray-900 dark:text-slate-100">${list.listadoOriginal}</span></p>
                <p class="font-semibold text-sm text-gray-500 dark:text-slate-400">Archivo: <span class="text-gray-700 dark:text-slate-300 italic">${list.fileName}</span></p>
            </div>
            <div class="flex flex-col space-y-2 items-end">
                ${areaActionButtonHtml} 
                <button data-list-id="${list.listId}" class="delete-list-btn px-3 py-1 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600">Eliminar Listado</button>
            </div>`;
        container.appendChild(item);
    });
}

export function renderDirectory() {
    const container = elements.settings.directoryContainer;
    const countEl = elements.settings.directoryCount;
    const areas = Object.keys(state.areaDirectory);

    countEl.textContent = `Total: ${areas.length}`;
    
    if (areas.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No se han cargado áreas con información de responsable.</p>';
        return;
    }
    
    container.innerHTML = areas.sort().map((areaKey, index) => {
        const areaInfo = state.areaDirectory[areaKey];
        return `
            <div class="p-3 rounded-lg bg-white dark:bg-slate-800 text-gray-800 border-l-4 border-indigo-400 shadow-sm">
                <div class="flex-grow">
                    <p class="font-bold text-sm text-gray-900 dark:text-slate-100">${index + 1}. ${areaInfo.fullName || `ÁREA ${areaKey}`}</p>
                    <p class="text-sm mt-1 text-gray-700 dark:text-slate-300">
                        <strong>Responsable:</strong> 
                        <span class="editable-field" data-area-key="${areaKey}" data-field="name" tabindex="0" contenteditable="false">
                              ${areaInfo.name || '(clic para editar)'}<i class="fa-solid fa-pencil editable-icon"></i>
                        </span>
                    </p>
                     <p class="text-sm text-gray-700 dark:text-slate-300">
                        <strong>Cargo:</strong> 
                        <span class="editable-field" data-area-key="${areaKey}" data-field="title" tabindex="0" contenteditable="false">
                              ${areaInfo.title || '(clic para editar)'}<i class="fa-solid fa-pencil editable-icon"></i>
                        </span>
                    </p>
                </div>
            </div>`;
    }).join('');
}

export function updateActiveUserBanner() {
    const { banner, name, area } = elements.activeUserBanner;
    const selectDesktop = document.getElementById('active-user-location-select');
    const selectMobile = document.getElementById('active-user-location-select-mobile');
    
    const tabsToShowOn = ['users', 'inventory', 'adicionales'];
    const currentTab = document.querySelector('.tab-btn.active')?.dataset.tab;

    if (state.activeResguardante && tabsToShowOn.includes(currentTab)) {
        name.textContent = state.activeResguardante.name;
        const areaName = state.areaNames[state.activeResguardante.area] || `Área ${state.activeResguardante.area}`;
        area.textContent = areaName;
        
        const locations = state.activeResguardante.locations && state.activeResguardante.locations.length > 0 
                          ? state.activeResguardante.locations 
                          : [state.activeResguardante.locationWithId || 'Ubicación Única'];

        const optionsHtml = locations.map(loc => `<option value="${loc}">${loc}</option>`).join('');
        
        if(selectDesktop) {
            const currentVal = selectDesktop.value;
            selectDesktop.innerHTML = optionsHtml;
            if (currentVal && locations.includes(currentVal)) selectDesktop.value = currentVal;
        }
        if(selectMobile) {
            selectMobile.innerHTML = optionsHtml;
        }
        banner.classList.remove('hidden');
    } else {
        banner.classList.add('hidden');
    }
}