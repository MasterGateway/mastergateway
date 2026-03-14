console.log('🔍 TEST: app.js está cargando...');

try {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✅ DOMContentLoaded ejecutado');
        
        const themeToggle = document.getElementById('themeToggle');
        const searchBtn = document.getElementById('searchBtn');
        
        console.log('themeToggle:', themeToggle);
        console.log('searchBtn:', searchBtn);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                console.log('✅ Click en themeToggle detectado');
                alert('Botón de tema funciona!');
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                console.log('✅ Click en searchBtn detectado');
                alert('Botón de búsqueda funciona!');
            });
        }
    });
} catch (error) {
    console.error('❌ ERROR:', error);
    alert('ERROR: ' + error.message);
}
