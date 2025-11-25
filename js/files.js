// js/files.js
import { state, logActivity, updateSerialNumberCache, generateUUID } from './state.js';
import { elements, showToast, showConfirmationModal } from './ui.js';

// --- LECTURA DE FECHAS INTELIGENTE ---
export function findReportDateSmart(sheet) {
    if (!sheet['!ref']) return 'S/F';
    const range = XLSX.utils.decode_range(sheet['!ref']);
    const maxRow = Math.min(range.e.r, 10); 
    const maxCol = Math.min(range.e.c, 30); 
    const dateRegex = /(\d{2})[\/\-](\d{2})[\/\-](\d{4})/;

    for (let R = 0; R <= maxRow; ++R) {
        for (let C = 0; C <= maxCol; ++C) {
            const cellRef = XLSX.utils.encode_cell({c: C, r: R});
            const cell = sheet[cellRef];
            if (!cell) continue;
            if (cell.t === 'n' && cell.v > 43000 && cell.v < 60000) {
                try {
                    const dateObj = XLSX.SSF.parse_date_code(cell.v);
                    if (dateObj) {
                        const day = String(dateObj.d).padStart(2, '0');
                        const month = String(dateObj.m).padStart(2, '0');
                        return `${day}/${month}/${dateObj.y}`;
                    }
                } catch (e) { console.error(e); }
            }
            if (cell.v) {
                const val = String(cell.v);
                const match = val.match(dateRegex);
                if (match) return match[0]; 
            }
        }
    }
    return 'S/F';
}

function extractResponsibleInfo(sheet) {
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
    // ... (Lógica resumida para brevedad, funciona igual que antes)
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        for (let j = 0; j < row.length; j++) {
            if (String(row[j]).trim().toLowerCase() === 'responsable') {
                if (i + 3 < data.length) {
                    const name = data[i + 2] ? String(data[i + 2][j] || '').trim() : null;
                    const title = data[i + 3] ? String(data[i + 3][j] || '').trim() : null;
                    if (name && title) return { name, title };
                }
            }
        }
    }
    return null;
}

// --- PROCESAMIENTO ---

export function processFile(file) {
    // No importamos 'checkReadOnlyMode' ni 'state' complejo para evitar ciclos.
    // Verificamos readOnlyMode en el evento principal si es necesario, o aquí simple:
    if (document.getElementById('read-only-mode-overlay') && !document.getElementById('read-only-mode-overlay').classList.contains('hidden')) {
        return showToast('Modo lectura activo.', 'warning');
    }

    const fileName = file.name;
    const proceedWithUpload = () => {
        elements.loadingOverlay.overlay.classList.add('show');
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const tipoLibro = sheet['B7']?.v || sheet['L7']?.v || 'Sin Tipo';
                addItemsFromFile(sheet, tipoLibro, fileName);
            } catch (error) {
                console.error(error);
                showToast('Error al procesar archivo.', 'error');
            } finally {
                elements.loadingOverlay.overlay.classList.remove('show');
            }
        };
        reader.readAsBinaryString(file);
    };

    const isFileAlreadyLoaded = state.inventory.some(item => item.fileName === fileName);
    if (isFileAlreadyLoaded) {
        showConfirmationModal('Archivo Duplicado', '¿Reemplazar archivo existente?', () => {
            state.inventory = state.inventory.filter(item => item.fileName !== fileName);
            proceedWithUpload();
        });
    } else {
        proceedWithUpload();
    }
}

function addItemsFromFile(sheet, tipoLibro, fileName) {
    const areaString = sheet['A10']?.v || 'Sin Área';
    const area = areaString.match(/AREA\s(\d+)/)?.[1] || 'Sin Área';
    const printDate = findReportDateSmart(sheet);
    const listId = Date.now();
    
    if (area && !state.areaNames[area]) state.areaNames[area] = areaString;
    
    const responsible = extractResponsibleInfo(sheet);
    if (area && responsible) {
        state.areaDirectory[area] = { fullName: areaString, name: responsible.name, title: responsible.title };
    }

    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 11 });
    const claveUnicaRegex = /^(?:\d{5,6}|0\.\d+)$/;

    const newItems = rawData.map(row => {
        const clave = String(row[0] || '').trim();
        if (!claveUnicaRegex.test(clave)) return null;
        return {
            'CLAVE UNICA': clave, 'DESCRIPCION': String(row[1] || ''), 
            'MARCA': row[4] || '', 'MODELO': row[5] || '', 'SERIE': row[6] || '',
            'NOMBRE DE USUARIO': '', 'UBICADO': 'NO', 'IMPRIMIR ETIQUETA': 'NO',
            'listadoOriginal': tipoLibro, 'areaOriginal': area,
            'listId': listId, 'fileName': fileName, 'printDate': printDate
        };
    }).filter(Boolean); 

    state.inventory = state.inventory.concat(newItems);
    state.inventoryFinished = false; 
    
    logActivity('Archivo cargado', `Archivo "${fileName}" (${newItems.length} bienes).`);
    showToast(`Cargados ${newItems.length} bienes del Área ${area}.`);

    updateSerialNumberCache();

    // --- CORRECCIÓN DE DEPENDENCIA CIRCULAR ---
    // En lugar de llamar a logic.js, disparamos un evento global.
    // logic.js escuchará este evento y actualizará la UI.
    window.dispatchEvent(new CustomEvent('inventory-updated'));
}

// (Mantén exportSession, importSession, exportXLSX igual que antes, 
// pero elimina cualquier llamada a saveState() o render() y usa el evento)
// ... Para abreviar, si necesitas el código completo de esas funciones dilo, 
// pero la clave es borrar los imports de './logic.js' al principio.