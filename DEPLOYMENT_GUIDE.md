# 🚀 Guía de Despliegue: MasterGateway en GitHub + Vercel

Esta guía te llevará paso a paso para tener tu aplicación **disponible en Internet 24/7 GRATIS**.

## ✅ Lo que necesitas

- Cuenta de GitHub (gratis)
- Cuenta de Vercel (gratis)
- Git instalado en tu PC

---

## 📦 PASO 1: Instalar Git (si no lo tienes)

### Windows:
1. Descarga: https://git-scm.com/download/win
2. Instala con opciones por defecto
3. Abre PowerShell o CMD y verifica:
```bash
git --version
```

---

## 🐙 PASO 2: Crear repositorio en GitHub

1. **Ve a:** https://github.com
2. **Click en:** "Sign up" (si no tienes cuenta) o "Sign in"
3. **Click en:** botón verde "New" (o el icono +)
4. **Llena:**
   - Repository name: `mastergateway`
   - Description: `Sistema Inteligente de Consulta de Estudiantes`
   - Selecciona: ✅ Public
   - NO marques: Initialize repository (dejalo vacío)
5. **Click:** "Create repository"

GitHub te mostrará instrucciones. **¡GUÁRDALAS!** Usarás la URL que dice:
```
https://github.com/TU_USUARIO/mastergateway.git
```

---

## 💻 PASO 3: Subir tu proyecto a GitHub

Abre **PowerShell** en la carpeta de tu proyecto:

```powershell
# 1. Ve a la carpeta del proyecto
cd D:\Downloads\UNAS-DNI\pagina_3\web_consulta

# 2. Inicializa Git
git init

# 3. Configura tu nombre y email (solo primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tuemail@ejemplo.com"

# 4. Agrega todos los archivos
git add .

# 5. Confirma los cambios (commit)
git commit -m "🚀 Initial commit - MasterGateway v1.0"

# 6. Renombra la rama principal
git branch -M main

# 7. Conecta con GitHub (cambia TU_USUARIO por tu usuario real)
git remote add origin https://github.com/TU_USUARIO/mastergateway.git

# 8. Sube los archivos
git push -u origin main
```

**⚠️ IMPORTANTE:** Si tienes muchas fotos grandes (>100MB), usa Git LFS:
```powershell
# Instalar Git LFS
git lfs install

# Rastrear fotos grandes
git lfs track "fotos/*.jpg"
git add .gitattributes
git commit -m "Add Git LFS for large images"
git push
```

---

## 🌐 PASO 4: Desplegar en Vercel

### A. Crear cuenta en Vercel

1. Ve a: https://vercel.com/signup
2. Click en: **"Continue with GitHub"**
3. Autoriza a Vercel a acceder a tu GitHub
4. ¡Listo! Ya tienes cuenta

### B. Importar tu proyecto

1. En el dashboard de Vercel, click: **"Add New..."** → **"Project"**
2. Busca tu repositorio: `mastergateway`
3. Click: **"Import"**
4. En la pantalla de configuración:
   - Framework Preset: **Other** (o dejar autodetect)
   - Root Directory: `.` (punto, significa raíz)
   - Build Command: (déjalo vacío)
   - Output Directory: (déjalo vacío)
   - Install Command: `pip install -r requirements.txt`
5. Click: **"Deploy"**

### C. Esperar el despliegue

Vercel hará lo siguiente (toma 2-5 minutos):
- ⚙️ Instalar Python
- ⚙️ Instalar dependencias (Flask, etc.)
- ⚙️ Subir archivos (JSON, fotos)
- ⚙️ Configurar servidor
- ✅ Generar URL pública

Verás una pantalla con confeti 🎉 cuando termine.

---

## 🎯 PASO 5: Obtener tu URL

Una vez desplegado, verás:
```
https://mastergateway-tu-usuario.vercel.app
```

¡**ESA ES TU URL PÚBLICA**! Compártela con quien quieras.

---

## 🔄 PASO 6: Actualizar tu sitio (cuando hagas cambios)

Cada vez que modifiques algo:

```powershell
# 1. Ve a la carpeta
cd D:\Downloads\UNAS-DNI\pagina_3\web_consulta

# 2. Agrega cambios
git add .

# 3. Confirma con mensaje
git commit -m "Descripción de cambios"

# 4. Sube a GitHub
git push
```

**¡Vercel detectará automáticamente los cambios y actualizará tu sitio en 1-2 minutos!** 🚀

---

## 🎨 PASO 7: Personalizar dominio (OPCIONAL)

### Opción A: Subdominio de Vercel (GRATIS)
1. En Vercel, ve a tu proyecto
2. Settings → Domains
3. Cambia `mastergateway-tu-usuario` por lo que quieras
4. Ejemplo: `unas-consulta.vercel.app`

### Opción B: Dominio propio (PAGO)
1. Compra un dominio (ej: mastergateway.com en Namecheap ~$10/año)
2. En Vercel → Settings → Domains
3. Agrega tu dominio
4. Configura DNS según las instrucciones de Vercel

---

## 📊 Monitorear tu sitio

En el dashboard de Vercel puedes ver:
- 📈 Visitas
- ⚡ Velocidad de carga
- 🐛 Errores
- 📊 Ancho de banda usado

---

## ⚠️ Solución de Problemas

### Error: "Too many files"
Si tienes muchas fotos (>1000):
```powershell
# Usa Git LFS
git lfs install
git lfs track "fotos/*.jpg"
git add .gitattributes
git commit -m "Add LFS"
git push --force
```

### Error: "Build failed"
Verifica que `requirements.txt` esté correcto:
```
Flask==3.0.0
Flask-CORS==4.0.0
```

### Fotos no cargan
Verifica que la ruta en `server.py` sea:
```python
@app.route('/fotos/<path:filename>')
def servir_foto(filename):
    return send_from_directory('fotos', filename)
```

---

## 🎉 ¡LISTO!

Ahora tienes:
- ✅ URL pública: `https://tu-proyecto.vercel.app`
- ✅ Disponible 24/7
- ✅ HTTPS automático
- ✅ Actualización automática al hacer push
- ✅ 100% GRATIS

---

## 📞 Soporte

- Documentación Vercel: https://vercel.com/docs
- GitHub Docs: https://docs.github.com
- Issues del proyecto: https://github.com/TU_USUARIO/mastergateway/issues

---

**¡Felicitaciones! 🎊 Tu aplicación ya está en la nube.**
