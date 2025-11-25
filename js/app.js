// js/app.js
/**
 * Punto de Entrada Principal
 * Inventario Pro v7.4 (Modular)
 */

import { initialize } from './logic.js';

// Esperamos a que el DOM esté completamente cargado antes de iniciar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando Inventario Pro v7.4 Modular...');
    
    // Iniciamos la lógica principal
    initialize();
});