// Global variables
let estudiantesData = null;
let botMessageElement = null;
let resultsSection = null;
let loadingElement = null;
let voiceEnabled = true;
let isSpeaking = false;
let currentUtterance = null;
let searchHistory = [];
let currentZoom = 1;
let isDarkMode = false;

// Speech synthesis
const synth = window.speechSynthesis;

// Load history from localStorage
function loadHistory() {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
        searchHistory = JSON.parse(saved);
    }
}

// Save history to localStorage
function saveHistory() {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Load theme preference
function loadTheme() {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').querySelector('.theme-icon').textContent = '☀️';
    }
}

// Block Developer Tools - DESACTIVADO
// (function() {
//     // Disable right click
//     document.addEventListener('contextmenu', function(e) {
//         e.preventDefault();
//         return false;
//     });
//     
//     // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
//     document.addEventListener('keydown', function(e) {
//         // F12
//         if (e.key === 'F12') {
//             e.preventDefault();
//             return false;
//         }
//         // Ctrl+Shift+I (Inspector)
//         if (e.ctrlKey && e.shiftKey && e.key === 'I') {
//             e.preventDefault();
//             return false;
//         }
//         // Ctrl+Shift+J (Console)
//         if (e.ctrlKey && e.shiftKey && e.key === 'J') {
//             e.preventDefault();
//             return false;
//         }
//         // Ctrl+U (View Source)
//         if (e.ctrlKey && e.key === 'u') {
//             e.preventDefault();
//             return false;
//         }
//         // Ctrl+Shift+C (Inspector Element)
//         if (e.ctrlKey && e.shiftKey && e.key === 'C') {
//             e.preventDefault();
//             return false;
//         }
//     });
//     
//     // Detect if DevTools is open
//     const detectDevTools = () => {
//         const threshold = 160;
//         if (window.outerWidth - window.innerWidth > threshold || 
//             window.outerHeight - window.innerHeight > threshold) {
//             document.body.innerHTML = '<h1 style="text-align:center;margin-top:50px;color:#ef4444;">⚠️ Acceso No Autorizado</h1>';
//         }
//     };
//     
//     window.addEventListener('resize', detectDevTools);
//     detectDevTools();
// })();

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Load preferences
    loadHistory();
    loadTheme();
    
    // Get DOM elements
    botMessageElement = document.getElementById('botMessage');
    resultsSection = document.getElementById('resultsSection');
    loadingElement = document.getElementById('loading');
    
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const voiceToggle = document.getElementById('voiceToggle');
    const suggestionsDropdown = document.getElementById('suggestionsDropdown');
    const themeToggle = document.getElementById('themeToggle');
    const menuBtn = document.getElementById('menuBtn');
    const menuDropdown = document.getElementById('menuDropdown');
    const menuOverlay = document.getElementById('menuOverlay');
    const clearHistory = document.getElementById('clearHistory');
    const infoBtn = document.getElementById('infoBtn');
    const contactBtn = document.getElementById('contactBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');

    // Load student data
    await loadStudentData();

    // Event listeners
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            suggestionsDropdown.classList.remove('active');
            performSearch();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        // Escape: Clear search and close modals
        if (e.key === 'Escape') {
            searchInput.value = '';
            suggestionsDropdown.classList.remove('active');
            menuDropdown.classList.remove('active');
            menuOverlay.classList.remove('active');
            closePhotoModal();
        }
    });

    // Autocomplete functionality
    searchInput.addEventListener('input', debounce(async function(e) {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            await fetchSuggestions(query);
        } else {
            suggestionsDropdown.classList.remove('active');
        }
    }, 300));

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsDropdown.contains(e.target)) {
            suggestionsDropdown.classList.remove('active');
        }
        if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
            menuDropdown.classList.remove('active');
            menuOverlay.classList.remove('active');
        }
    });

    // Voice toggle
    voiceToggle.addEventListener('click', function() {
        voiceEnabled = !voiceEnabled;
        if (!voiceEnabled) {
            stopSpeaking();
            voiceToggle.classList.add('muted');
            voiceToggle.textContent = '🔇';
        } else {
            voiceToggle.classList.remove('muted');
            voiceToggle.textContent = '🔊';
        }
    });

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Menu dropdown
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        menuDropdown.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        renderHistory();
    });

    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', function() {
        menuDropdown.classList.remove('active');
        menuOverlay.classList.remove('active');
    });

    clearHistory.addEventListener('click', function() {
        searchHistory = [];
        saveHistory();
        renderHistory();
        showToast('Historial limpiado', 'info');
    });

    // Info button
    infoBtn.addEventListener('click', function() {
        showToast('MasterGateway v1.0 - Sistema Inteligente de Consulta', 'info');
        menuDropdown.classList.remove('active');
        menuOverlay.classList.remove('active');
    });

    // Contact button
    contactBtn.addEventListener('click', function() {
        showToast('Contacto: soporte@mastergateway.com', 'info');
        menuDropdown.classList.remove('active');
        menuOverlay.classList.remove('active');
    });

    // Modal controls
    modalOverlay.addEventListener('click', closePhotoModal);
    modalClose.addEventListener('click', closePhotoModal);
    document.getElementById('zoomIn').addEventListener('click', () => zoomPhoto(0.2));
    document.getElementById('zoomOut').addEventListener('click', () => zoomPhoto(-0.2));
    document.getElementById('zoomReset').addEventListener('click', () => resetZoom());

    // Update history count
    updateHistoryCount();
    
    // Welcome message with voice - wait for voices to load
    if (synth) {
        // Load voices first
        if (synth.getVoices().length === 0) {
            synth.addEventListener('voiceschanged', function() {
                setTimeout(() => {
                    speak('¡Bienvenido a MasterGateway! Sistema inteligente de consulta. Por favor, introduzca la información de la persona que desea buscar.');
                }, 500);
            }, { once: true });
        } else {
            setTimeout(() => {
                speak('¡Bienvenido a MasterGateway! Sistema inteligente de consulta. Por favor, introduzca la información de la persona que desea buscar.');
            }, 500);
        }
    }
    
    // Also speak on first user interaction
    let hasSpokenWelcome = false;
    const firstInteraction = function() {
        if (!hasSpokenWelcome) {
            hasSpokenWelcome = true;
            speak('¡Bienvenido! Puede buscar por nombre, DNI o código universitario.');
            document.removeEventListener('click', firstInteraction);
            document.removeEventListener('keydown', firstInteraction);
        }
    };
    document.addEventListener('click', firstInteraction, { once: true });
    document.addEventListener('keydown', firstInteraction, { once: true });
}

async function loadStudentData() {
    try {
        const response = await fetch('/api/estudiantes');
        if (!response.ok) {
            throw new Error('No se pudo cargar los datos');
        }
        estudiantesData = await response.json();
        console.log('Datos cargados:', estudiantesData.total, 'estudiantes');
    } catch (error) {
        console.error('Error al cargar datos:', error);
        updateBotMessage('❌ Error al cargar la base de datos. Por favor, recargue la página.', 'error');
    }
}

// Fetch suggestions from API
async function fetchSuggestions(query) {
    try {
        const response = await fetch(`/api/sugerencias?q=${encodeURIComponent(query)}&limit=8`);
        const data = await response.json();
        displaySuggestions(data.sugerencias);
    } catch (error) {
        console.error('Error al obtener sugerencias:', error);
    }
}

// Display suggestions dropdown
function displaySuggestions(sugerencias) {
    const dropdown = document.getElementById('suggestionsDropdown');
    
    if (sugerencias.length === 0) {
        dropdown.classList.remove('active');
        return;
    }

    dropdown.innerHTML = '';
    
    sugerencias.forEach(sugerencia => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        
        const icon = sugerencia.tipo === 'nombre' ? '👤' : 
                    sugerencia.tipo === 'dni' ? '🆔' : '📋';
        
        item.innerHTML = `
            <span class="suggestion-icon">${icon}</span>
            <span class="suggestion-text">${escapeHtml(sugerencia.texto)}</span>
            <span class="suggestion-type">${sugerencia.tipo}</span>
        `;
        
        item.addEventListener('click', function() {
            // Use the actual value (codigo, dni, or nombre) instead of formatted text
            const searchValue = sugerencia.valor || sugerencia.texto;
            document.getElementById('searchInput').value = searchValue;
            dropdown.classList.remove('active');
            performSearch();
        });
        
        dropdown.appendChild(item);
    });
    
    dropdown.classList.add('active');
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    // Hide suggestions
    document.getElementById('suggestionsDropdown').classList.remove('active');
    
    if (!searchTerm) {
        const message = '⚠️ Por favor, introduzca un término de búsqueda (nombre, DNI o código).';
        updateBotMessage(message, 'warning');
        speak('Por favor, introduzca un término de búsqueda');
        return;
    }

    if (!estudiantesData) {
        const message = '❌ Los datos aún no están cargados. Por favor, espere un momento.';
        updateBotMessage(message, 'error');
        speak('Los datos aún no están cargados. Por favor, espere un momento.');
        return;
    }

    // Show loading
    showLoading();

    // Search using API
    setTimeout(async () => {
        try {
            const response = await fetch(`/api/buscar?q=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();
            
            // Add to history if results found
            if (data.resultados.length > 0) {
                addToHistory(searchTerm);
            }
            
            displayResults(data.resultados, searchTerm);
        } catch (error) {
            console.error('Error en búsqueda:', error);
            hideLoading();
            const message = '❌ Error al realizar la búsqueda.';
            updateBotMessage(message, 'error');
            speak('Error al realizar la búsqueda');
        }
    }, 500);
}

function searchStudents(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    const results = [];

    for (const estudiante of estudiantesData.estudiantes) {
        // Search by name
        const nombreCompleto = estudiante.nombres_completo?.toLowerCase() || '';
        
        // Search by DNI
        const dni = estudiante.dni?.toLowerCase() || '';
        
        // Search by code
        const codigo = estudiante.codigo?.toLowerCase() || '';

        // Check if any field matches
        if (nombreCompleto.includes(term) || 
            dni.includes(term) || 
            codigo.includes(term)) {
            results.push(estudiante);
        }
    }

    return results;
}

function displayResults(results, searchTerm) {
    hideLoading();
    resultsSection.innerHTML = '';
    resultsSection.classList.add('active');

    if (results.length === 0) {
        const message = `😕 No se encontraron resultados para "<strong>${escapeHtml(searchTerm)}</strong>". Por favor, intente con otro término de búsqueda.`;
        updateBotMessage(message, 'error');
        speak(`No se encontraron resultados para ${searchTerm}. Por favor, intente con otro término de búsqueda.`);
        resultsSection.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No se encontraron resultados</h3>
                <p>No hay coincidencias para "${escapeHtml(searchTerm)}"</p>
            </div>
        `;
        return;
    }

    // Update bot message based on results
    if (results.length === 1) {
        const estudiante = results[0];
        const message = `✅ ¡Resultado encontrado! Se ha localizado la información de <strong>${escapeHtml(estudiante.nombres_completo)}</strong>.`;
        updateBotMessage(message, 'success');
        speak(`¡Resultado encontrado! Se ha localizado la información de ${estudiante.nombres_completo}.`);
    } else {
        const message = `✅ ¡Resultados encontrados! Se localizaron <strong>${results.length} estudiantes</strong> que coinciden con su búsqueda.`;
        updateBotMessage(message, 'success');
        speak(`¡Resultados encontrados! Se localizaron ${results.length} estudiantes que coinciden con su búsqueda.`);
    }

    // Display each result
    results.forEach(estudiante => {
        const resultCard = createResultCard(estudiante);
        resultsSection.appendChild(resultCard);
    });
}

function createResultCard(estudiante) {
    const card = document.createElement('div');
    card.className = 'result-card';

    // Check if photo exists and extract filename
    let fotoPath = null;
    if (estudiante.foto_local) {
        // Extract just the filename from the full path
        const fotoFilename = estudiante.foto_local.includes('\\') || estudiante.foto_local.includes('/') ?
            estudiante.foto_local.split(/[\\\/]/).pop() : estudiante.foto_local;
        fotoPath = `/fotos/${fotoFilename}`;
    }
    const hasFoto = estudiante.foto_local && estudiante.estado_foto !== 'No se encontró foto';

    // Generate email if not exists: primerNombre.segundoApellido@unas.edu.pe
    let emailMostrar = estudiante.email;
    let emailGenerado = false;
    
    if (!emailMostrar || emailMostrar.trim() === '') {
        // Get complete data
        const nombres = estudiante.datos_completos?.nombre || '';
        const apellidoPaterno = estudiante.datos_completos?.appaterno || '';
        
        if (nombres && apellidoPaterno) {
            // Get first name
            const primerNombre = nombres.split(' ')[0].toLowerCase();
            // Get paternal surname (second apellido)
            const segundoApellido = apellidoPaterno.toLowerCase();
            
            emailMostrar = `${primerNombre}.${segundoApellido}@unas.edu.pe`;
            emailGenerado = true;
        } else {
            emailMostrar = 'No registrado';
        }
    }

    card.innerHTML = `
        <div class="result-header">
            <div class="result-header-icon">👤</div>
            <div class="result-header-text">
                <h2>${escapeHtml(estudiante.nombres_completo || 'N/A')}</h2>
                <p>Código: ${escapeHtml(estudiante.codigo || 'N/A')}</p>
            </div>
        </div>
        <div class="result-body">
            <div class="result-photo">
                <div class="photo-container">
                    ${hasFoto ? 
                        `<img src="${fotoPath}" alt="Foto de ${escapeHtml(estudiante.nombres_completo)}" onerror="this.parentElement.innerHTML='<div class=\\'no-photo\\'>📷</div>'">` :
                        '<div class="no-photo">📷</div>'
                    }
                </div>
                <div class="photo-status ${hasFoto ? 'available' : 'unavailable'}">
                    ${hasFoto ? '✓ Fotografía disponible' : '✗ Sin fotografía'}
                </div>
            </div>
            <div class="result-info">
                <div class="info-group">
                    <div class="info-label">📋 Código Universitario</div>
                    <div class="info-value">${escapeHtml(estudiante.codigo || 'N/A')}</div>
                </div>
                <div class="info-group">
                    <div class="info-label">🆔 DNI</div>
                    <div class="info-value">${escapeHtml(estudiante.dni || 'N/A')}</div>
                </div>
                <div class="info-group">
                    <div class="info-label">👤 Nombre Completo</div>
                    <div class="info-value">${escapeHtml(estudiante.nombres_completo || 'N/A')}</div>
                </div>
                <div class="info-group">
                    <div class="info-label">📧 Email</div>
                    <div class="info-value ${emailGenerado ? 'generated' : (!estudiante.email ? 'empty' : '')}" title="${emailGenerado ? 'Email generado automáticamente' : ''}">
                        ${escapeHtml(emailMostrar)}
                        ${emailGenerado ? '<span class="badge-auto">AUTO</span>' : ''}
                    </div>
                </div>
                <div class="info-group">
                    <div class="info-label">📱 Celular</div>
                    <div class="info-value ${!estudiante.celular ? 'empty' : ''}">${escapeHtml(estudiante.celular || 'No registrado')}</div>
                </div>
                <div class="info-group">
                    <div class="info-label">📅 Año de Ingreso</div>
                    <div class="info-value">${escapeHtml(estudiante.anio_ingreso || 'N/A')}</div>
                </div>
                ${estudiante.datos_completos?.appaterno ? `
                <div class="info-group">
                    <div class="info-label">👨 Apellido Paterno</div>
                    <div class="info-value">${escapeHtml(estudiante.datos_completos.appaterno)}</div>
                </div>
                ` : ''}
                ${estudiante.datos_completos?.apmaterno ? `
                <div class="info-group">
                    <div class="info-label">👩 Apellido Materno</div>
                    <div class="info-value">${escapeHtml(estudiante.datos_completos.apmaterno)}</div>
                </div>
                ` : ''}
                ${estudiante.datos_completos?.nombre ? `
                <div class="info-group">
                    <div class="info-label">✨ Nombres</div>
                    <div class="info-value">${escapeHtml(estudiante.datos_completos.nombre)}</div>
                </div>
                ` : ''}
                <div class="info-group">
                    <div class="info-label">🕐 Fecha de Consulta</div>
                    <div class="info-value">${formatDate(estudiante.fecha_consulta)}</div>
                </div>
            </div>
        </div>
        <div class="action-buttons">
            <button class="action-btn btn-whatsapp ${!estudiante.celular ? 'btn-disabled' : ''}" 
                    onclick='openWhatsApp("${estudiante.celular || ''}")' 
                    ${!estudiante.celular ? 'disabled' : ''}>
                💬 WhatsApp
            </button>
            <button class="action-btn btn-copy" onclick='copyToClipboard("${emailMostrar}", "Email")'>
                📋 Copiar Email
            </button>
        </div>
    `;

    // Add click handler to photo
    if (hasFoto) {
        setTimeout(() => {
            const photoImg = card.querySelector('.photo-container img');
            if (photoImg) {
                photoImg.style.cursor = 'pointer';
                photoImg.onclick = function() {
                    openPhotoModal(fotoPath, estudiante.nombres_completo, estudiante.codigo);
                };
            }
        }, 100);
    }

    return card;
}

function updateBotMessage(message, type = 'info') {
    botMessageElement.innerHTML = message;
    
    // Add animation
    botMessageElement.style.animation = 'none';
    setTimeout(() => {
        botMessageElement.style.animation = 'fadeIn 0.5s ease-out';
    }, 10);
}

// Text-to-Speech function
function speak(text) {
    if (!voiceEnabled || !synth) return;
    
    // Stop any ongoing speech
    stopSpeaking();
    
    // Remove HTML tags for speaking
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ');
    
    currentUtterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance.lang = 'es-ES';
    currentUtterance.rate = 0.9;
    currentUtterance.pitch = 1;
    currentUtterance.volume = 1;
    
    const voiceToggle = document.getElementById('voiceToggle');
    
    currentUtterance.onstart = function() {
        isSpeaking = true;
        voiceToggle.classList.add('speaking');
    };
    
    currentUtterance.onend = function() {
        isSpeaking = false;
        voiceToggle.classList.remove('speaking');
    };
    
    currentUtterance.onerror = function(event) {
        console.error('Error en síntesis de voz:', event);
        isSpeaking = false;
        voiceToggle.classList.remove('speaking');
    };
    
    // Try to use a Spanish voice
    const voices = synth.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.startsWith('es'));
    if (spanishVoice) {
        currentUtterance.voice = spanishVoice;
    }
    
    synth.speak(currentUtterance);
}

function stopSpeaking() {
    if (synth && isSpeaking) {
        synth.cancel();
        isSpeaking = false;
        const voiceToggle = document.getElementById('voiceToggle');
        if (voiceToggle) {
            voiceToggle.classList.remove('speaking');
        }
    }
}

function showLoading() {
    loadingElement.classList.add('active');
    resultsSection.classList.remove('active');
}

function hideLoading() {
    loadingElement.classList.remove('active');
}

/* DISABLED - Stats section removed
function updateStats() {
    // Fetch stats from API
    fetch('/api/estadisticas')
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalEstudiantes').textContent = data.total_estudiantes || 0;
            document.getElementById('totalFotos').textContent = data.con_fotos || 0;
            
            if (data.ultima_actualizacion && data.ultima_actualizacion !== 'N/A') {
                const fecha = new Date(data.ultima_actualizacion);
                document.getElementById('ultimaActualizacion').textContent = 
                    fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            }
        })
        .catch(error => {
            console.error('Error al cargar estadísticas:', error);
        });
}
*/

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== NEW FEATURES =====

// Theme Toggle
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    const icon = document.getElementById('themeToggle').querySelector('.theme-icon');
    icon.textContent = isDarkMode ? '☀️' : '🌙';
    
    showToast(isDarkMode ? 'Modo oscuro activado' : 'Modo claro activado', 'info');
}

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.success}</span>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// History Management
function addToHistory(searchTerm) {
    const historyItem = {
        text: searchTerm,
        timestamp: new Date().toISOString()
    };
    
    // Remove duplicates
    searchHistory = searchHistory.filter(item => item.text !== searchTerm);
    
    // Add to beginning
    searchHistory.unshift(historyItem);
    
    // Keep only last 10
    if (searchHistory.length > 10) {
        searchHistory = searchHistory.slice(0, 10);
    }
    
    saveHistory();
}

function renderHistory() {
    const listElement = document.getElementById('historyList');
    
    if (!listElement) {
        console.error('historyList element not found');
        return;
    }
    
    if (searchHistory.length === 0) {
        listElement.innerHTML = '<p class="empty-history">No hay búsquedas recientes</p>';
        return;
    }
    
    listElement.innerHTML = searchHistory.map(item => {
        const time = new Date(item.timestamp);
        const timeStr = time.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Escapar comillas simples en el texto para evitar problemas en onclick
        const safeText = item.text.replace(/'/g, "\\'");
        
        return `
            <div class="history-item" onclick="searchFromHistory('${safeText}')">
                <div class="history-item-text">${escapeHtml(item.text)}</div>
                <div class="history-item-time">${timeStr}</div>
            </div>
        `;
    }).join('');
}

function searchFromHistory(term) {
    document.getElementById('searchInput').value = term;
    document.getElementById('historyDropdown').classList.remove('active');
    performSearch();
}

// Photo Modal
function openPhotoModal(fotoSrc, nombre, codigo) {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalCode = document.getElementById('modalCode');
    
    modalImage.src = fotoSrc;
    modalName.textContent = nombre;
    modalCode.textContent = `Código: ${codigo}`;
    
    modal.classList.add('active');
    resetZoom();
}

function closePhotoModal() {
    document.getElementById('photoModal').classList.remove('active');
}

function zoomPhoto(delta) {
    currentZoom += delta;
    currentZoom = Math.max(0.5, Math.min(currentZoom, 3)); // Between 0.5x and 3x
    
    const img = document.getElementById('modalImage');
    img.style.transform = `scale(${currentZoom})`;
}

function resetZoom() {
    currentZoom = 1;
    const img = document.getElementById('modalImage');
    img.style.transform = 'scale(1)';
}

// WhatsApp
function openWhatsApp(celular) {
    if (!celular) {
        showToast('No hay número de celular registrado', 'error');
        return;
    }
    
    // Remove any non-numeric characters
    const cleanNumber = celular.replace(/\D/g, '');
    const url = `https://wa.me/51${cleanNumber}`;
    window.open(url, '_blank');
    showToast('Abriendo WhatsApp...', 'success');
}

// Copy to Clipboard
function copyToClipboard(text, label = 'Texto') {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`${label} copiado al portapapeles`, 'success');
    }).catch(err => {
        showToast('Error al copiar', 'error');
        console.error('Copy error:', err);
    });
}
