# 🚀 MasterGateway - GUÍA DE PRUEBA

## ✅ Funcionalidades Implementadas

### 1. 🌓 Modo Oscuro/Claro
- **Ubicación**: Botón 🌙/☀️ en la esquina superior derecha del header
- **Cómo probar**:
  1. Click en el botón
  2. La página debe cambiar de colores claros a oscuros
  3. El ícono cambia de 🌙 a ☀️
  4. Se guarda en localStorage (persiste al recargar)

### 2. 🕐 Historial de Búsquedas
- **Ubicación**: Botón 🕐 en el header (al lado del modo oscuro)
- **Cómo probar**:
  1. Realiza algunas búsquedas
  2. Click en el botón del historial
  3. Se abre un menú dropdown
  4. Muestra las últimas 10 búsquedas con fecha/hora
  5. Click en cualquier búsqueda = busca de nuevo
  6. Botón "Limpiar" = borra todo el historial

**Badge de contador**: Muestra cuántas búsquedas tienes

### 3. 📧 Email Automático
- **Comportamiento**: Si un estudiante NO tiene email, se genera automáticamente
- **Formato**: `primerNombre.apellidoPaterno@unas.edu.pe`
- **Indicador**: Badge "AUTO" azul al lado del email
- **Ejemplo**: MARIA GARCIA LOPEZ → `maria.garcia@unas.edu.pe AUTO`

### 4. 📱 Botón de WhatsApp
- **Ubicación**: En cada resultado, si el estudiante tiene celular
- **Cómo probar**:
  1. Busca un estudiante con celular
  2. Verás un botón verde "💬 WhatsApp"
  3. Click = abre WhatsApp Web con el número

### 5. 🖼️ Vista Previa de Foto (Modal)
- **Cómo probar**:
  1. Busca un estudiante con foto
  2. Click en la foto
  3. Se abre un modal grande con:
     - Foto ampliada
     - Nombre y código
     - Botones de zoom (+, -, reset)
     - Botón cerrar (X) o ESC
  4. Prueba hacer zoom con los botones

### 6. 📄 Descargar PDF
- **Ubicación**: Botón "📄 Descargar PDF" en cada resultado
- **Contenido del PDF**:
  - Header "MasterGateway"
  - Foto del estudiante
  - Tabla con todos los datos:
    * Código Universitario
    * DNI
    * Nombre Completo
    * Email (con indicador AUTO si es generado)
    * Celular
    * Año de Ingreso
  - Fecha de generación

### 7. 🔔 Notificaciones Toast
- **Aparecen automáticamente** en la esquina superior derecha
- **Tipos**:
  - ✅ Success (verde): "Resultado encontrado", "PDF descargado"
  - ℹ️ Info (azul): "Historial limpiado", "Email copiado"
  - ❌ Error (rojo): "Error al generar PDF"
- **Duración**: 3 segundos (desaparecen automáticamente)

### 8. ⌨️ Atajos de Teclado
- **Ctrl + K** o **Cmd + K**: Enfocar el campo de búsqueda
- **Enter**: Buscar
- **Escape**: Cerrar todo (sugerencias, historial, modal)

### 9. 🔒 Seguridad
- ❌ Click derecho bloqueado
- ❌ F12 bloqueado
- ❌ Ctrl+Shift+I bloqueado
- ❌ Ctrl+U bloqueado
- ❌ Detector de DevTools

## 🧪 Secuencia de Prueba Completa

### Paso 1: Verificar Carga Inicial
```
✓ Página carga sin errores
✓ Bot dice mensaje de bienvenida (si haces click)
✓ Header muestra "MasterGateway"
✓ Botones de tema e historial visibles
✓ Historial muestra "0" o número si hay búsquedas previas
```

### Paso 2: Prueba de Búsqueda
```
1. Escribe "MARIA" en el buscador
2. Aparecen sugerencias automáticas
3. Click en una sugerencia o Enter
4. Se muestra resultado con:
   ✓ Foto (si tiene)
   ✓ Datos completos
   ✓ Email (AUTO si no tiene)
   ✓ Botón WhatsApp (si tiene celular)
   ✓ Botón Descargar PDF
```

### Paso 3: Prueba del Historial
```
1. Realiza 3 búsquedas diferentes
2. Click en botón 🕐
3. Dropdown se abre
4. Muestra las 3 búsquedas con fecha/hora
5. Click en una búsqueda antigua
6. Busca de nuevo ese término
7. Click "Limpiar"
8. Historial queda vacío
```

### Paso 4: Prueba del Modal de Foto
```
1. Busca estudiante con foto
2. Click en la foto
3. Modal se abre
4. Click en "+"  = zoom in
5. Click en "-"  = zoom out
6. Click en "Reset" = vuelve al tamaño original
7. Click en X o ESC = cierra modal
```

### Paso 5: Prueba del PDF
```
1. Busca un estudiante
2. Click en "📄 Descargar PDF"
3. Toast aparece: "Generando PDF..."
4. Espera 2-3 segundos
5. Toast aparece: "PDF descargado correctamente"
6. Archivo se descarga con nombre: CODIGO_NOMBRE.pdf
7. Abre el PDF y verifica que contenga:
   ✓ Header "MasterGateway"
   ✓ Foto (si tiene)
   ✓ Tabla con todos los datos
   ✓ Fecha de generación
```

### Paso 6: Prueba del Modo Oscuro
```
1. Click en botón 🌙
2. Página cambia a modo oscuro
3. Ícono cambia a ☀️
4. Recarga la página (F5)
5. Modo oscuro persiste
6. Click en ☀️
7. Vuelve a modo claro
```

### Paso 7: Prueba de WhatsApp
```
1. Busca estudiante con celular
2. Verifica que aparezca botón verde "💬 WhatsApp"
3. Click en el botón
4. Se abre WhatsApp Web en nueva pestaña
5. Número ya está cargado
```

## 🐛 Problemas Conocidos y Soluciones

### Historial no se muestra
**Solución**:
1. Abre la consola (Ctrl+Shift+I si está permitido)
2. Escribe: `localStorage.getItem('searchHistory')`
3. Si está null, haz búsquedas nuevas
4. Recarga la página

### PDF solo muestra "MasterGateway"
**Verificar**:
1. La librería html2pdf está cargada (ver console)
2. El estudiante tiene datos completos
3. Espera que termine de generar (toast "Generando...")

### Bot no habla al inicio
**Solución**:
1. Haz click en cualquier parte de la página
2. El navegador necesita interacción del usuario
3. Verifica que el botón esté en 🔊 (no 🔇)

### Modal de foto no se abre
**Verificar**:
1. El estudiante tiene foto
2. La foto se cargó correctamente
3. La carpeta fotos/ existe

## 📊 Checklist Final

- [ ] Búsqueda funciona
- [ ] Autocompletado aparece
- [ ] Historial guarda búsquedas
- [ ] Historial se puede limpiar
- [ ] Modo oscuro funciona
- [ ] Modo oscuro persiste
- [ ] Email AUTO se genera correctamente
- [ ] Botón WhatsApp aparece (si tiene celular)
- [ ] Modal de foto se abre
- [ ] Zoom funciona en modal
- [ ] PDF se descarga
- [ ] PDF contiene todos los datos
- [ ] Toasts aparecen y desaparecen
- [ ] Atajos de teclado funcionan
- [ ] Click derecho bloqueado
- [ ] F12 bloqueado

## 🚀 Servidor

Para iniciar el servidor:
```bash
cd web_consulta
python server.py
```

Abre: `http://localhost:5000`

---

**© 2026 MasterGateway** - Sistema Inteligente de Consulta
