# 🔍 Solución de Problemas en Vercel

## ❌ Problema: "Información no encontrada" en Vercel

### Causas comunes:

1. **Archivos no subidos correctamente a Git**
2. **Rutas incorrectas en Vercel**
3. **Variables de entorno faltantes**
4. **Archivos grandes bloqueados**

---

## ✅ Solución Paso a Paso

### PASO 1: Verificar que los archivos estén en Git

```powershell
cd D:\Downloads\UNAS-DNI\pagina_3\web_consulta

# Ver archivos rastreados
git ls-files | Select-String "estudiantes.json"
git ls-files fotos/ | Measure-Object -Line

# Deberías ver:
# - estudiantes.json ✓
# - 1964 fotos ✓
```

**Si NO aparecen:**
```powershell
# Agregar archivos
git add estudiantes.json
git add fotos/
git commit -m "Add estudiantes.json and fotos"
git push
```

---

### PASO 2: Verificar el tamaño de los archivos

Vercel tiene límites:
- ⚠️ **Archivos individuales**: Max 100MB
- ⚠️ **Proyecto total**: Max 100MB (sin LFS)

```powershell
# Ver tamaño del JSON
(Get-Item estudiantes.json).Length / 1MB
# Debe ser < 10MB

# Ver tamaño total de fotos
(Get-ChildItem fotos\*.jpg | Measure-Object -Property Length -Sum).Sum / 1MB
# Si es > 100MB, necesitas Git LFS
```

**Si son archivos grandes:**
```powershell
# Instalar Git LFS
git lfs install

# Rastrear archivos grandes
git lfs track "fotos/*.jpg"
git add .gitattributes
git commit -m "Add Git LFS for photos"
git push --force
```

---

### PASO 3: Verificar logs en Vercel

1. Ve a: https://vercel.com/tu-usuario/mastergateway
2. Click en el último deployment
3. Click en "View Function Logs"
4. Busca errores como:
   - `FileNotFoundError: estudiantes.json`
   - `No such file or directory: 'fotos'`

---

### PASO 4: Probar endpoint de salud

Una vez desplegado, abre en el navegador:
```
https://tu-proyecto.vercel.app/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "estudiantes_cargados": 1042,
  "tiene_datos": true,
  "json_exists": true,
  "fotos_dir_exists": true,
  "version": "1.0.0"
}
```

**Si ves `false` en algún campo:**
- Los archivos NO se subieron correctamente
- Vuelve al PASO 1

---

### PASO 5: Forzar redespliegue

A veces Vercel cachea mal los archivos:

1. En Vercel → Settings → General
2. Baja hasta "Redeploy"
3. Click "Redeploy" (mantén "Use existing Build Cache" DESMARCADO)

---

### PASO 6: Verificar variables de entorno (si usas)

Si tu `estudiantes.json` tiene rutas absolutas o URLs:

1. Vercel → Settings → Environment Variables
2. Agrega:
   - `DATA_PATH` = `/var/task/estudiantes.json`
   - `FOTOS_PATH` = `/var/task/fotos`

---

## 🐛 Errores Específicos

### Error: "estudiantes_cargados: 0"

**Causa:** `estudiantes.json` no se cargó

**Solución:**
```powershell
# Verificar que existe
git ls-files | Select-String "estudiantes.json"

# Si no está:
git add estudiantes.json
git commit -m "Add students data"
git push

# Espera 1-2 minutos y recarga Vercel
```

---

### Error: "Fotos no cargan (404)"

**Causa:** Carpeta `fotos/` no subida o rutas incorrectas

**Solución:**
```powershell
# Verificar fotos en Git
git ls-files fotos/ | Measure-Object -Line

# Si da 0:
git add fotos/
git commit -m "Add student photos"
git push
```

**Si son muchas fotos:**
```powershell
# Usar Git LFS
git lfs track "fotos/*.jpg"
git add .gitattributes fotos/
git commit -m "Add photos with LFS"
git push
```

---

### Error: "Module not found: flask_cors"

**Causa:** `requirements.txt` incorrecto

**Solución:**
Verifica que `requirements.txt` tenga:
```
Flask==3.0.0
Flask-CORS==4.0.0
```

```powershell
git add requirements.txt
git commit -m "Fix requirements"
git push
```

---

## 🚀 Alternativa: Usar Cloudinary para fotos

Si las fotos son muy grandes (>100MB total):

### Opción A: Subir a Cloudinary
1. Crea cuenta en https://cloudinary.com (GRATIS)
2. Sube las fotos
3. Actualiza `estudiantes.json` con URLs de Cloudinary
4. Sube solo el JSON a Vercel

### Opción B: Usar GitHub como CDN
1. Deja las fotos en GitHub
2. Accede vía:
   ```
   https://raw.githubusercontent.com/TU_USUARIO/mastergateway/main/fotos/0020240001.jpg
   ```

---

## 📝 Checklist de Diagnóstico

Marca lo que has verificado:

- [ ] `git ls-files | Select-String estudiantes.json` → Aparece ✓
- [ ] `git ls-files fotos/ | Measure` → Muestra ~1964 fotos ✓
- [ ] Archivos totales < 100MB (o usando Git LFS)
- [ ] `git push` ejecutado sin errores
- [ ] Vercel muestra "Deployment Ready"
- [ ] `/api/health` responde con `status: "ok"`
- [ ] `/api/estudiantes` devuelve datos
- [ ] Logs de Vercel sin errores críticos

---

## 🆘 Si nada funciona

### Plan B: Deploy local primero

```powershell
cd D:\Downloads\UNAS-DNI\pagina_3\web_consulta
python server.py
```

Abre: http://localhost:5000

**Si funciona local pero NO en Vercel:**
- El problema está en Git o en la configuración de Vercel
- Revisa que TODOS los archivos estén en Git

**Si NO funciona ni local:**
- El problema está en el código o en los datos
- Revisa `server.py` y `estudiantes.json`

---

## 📧 Logs útiles para depuración

```powershell
# Ver último commit
git log -1 --stat

# Ver archivos en el último commit
git show --name-only

# Ver si Git LFS está activo
git lfs ls-files
```

---

## ✅ Resumen de Archivos Críticos

| Archivo | Propósito | ¿En Git? |
|---------|-----------|----------|
| `server.py` | Backend Flask | ✅ SÍ |
| `estudiantes.json` | Base de datos | ✅ SÍ |
| `fotos/` | Fotografías | ✅ SÍ |
| `requirements.txt` | Dependencias Python | ✅ SÍ |
| `vercel.json` | Config Vercel | ✅ SÍ |
| `runtime.txt` | Versión Python | ✅ SÍ |
| `.gitignore` | Archivos ignorados | ✅ SÍ |

Todos deben estar en Git para que Vercel funcione.
