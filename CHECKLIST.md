# ✅ Checklist de Despliegue

## Antes de subir a GitHub

- [x] `vercel.json` creado ✅
- [x] `.gitignore` creado ✅
- [x] `runtime.txt` creado ✅
- [x] `requirements.txt` existe ✅
- [x] `server.py` actualizado para Vercel ✅
- [ ] Verificar que todas las fotos estén en `fotos/`
- [ ] Verificar que `estudiantes.json` esté actualizado

## Pasos para desplegar

### 1️⃣ Instalar Git
```powershell
# Verifica si ya tienes Git
git --version

# Si no, descarga de: https://git-scm.com/download/win
```

### 2️⃣ Crear cuenta GitHub
- Ve a: https://github.com/signup
- Crea tu cuenta GRATIS

### 3️⃣ Crear repositorio
- Click en "+" → "New repository"
- Nombre: `mastergateway`
- Público ✅
- NO marques "Initialize"
- Click "Create repository"

### 4️⃣ Subir código
```powershell
cd D:\Downloads\UNAS-DNI\pagina_3\web_consulta

git init
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
git add .
git commit -m "🚀 Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mastergateway.git
git push -u origin main
```

### 5️⃣ Desplegar en Vercel
- Ve a: https://vercel.com/signup
- "Continue with GitHub"
- Autoriza Vercel
- "Add New..." → "Project"
- Selecciona `mastergateway`
- Click "Deploy"
- Espera 2-3 minutos ⏳

### 6️⃣ ¡LISTO! 🎉
Tu sitio estará en:
```
https://mastergateway-tu-usuario.vercel.app
```

## Verificar que funcione

- [ ] La página principal carga
- [ ] El bot aparece y puede hablar
- [ ] La búsqueda funciona
- [ ] El autocompletado funciona
- [ ] Las fotos se ven correctamente
- [ ] El modo oscuro funciona
- [ ] El historial funciona
- [ ] Funciona en móvil

## Para actualizar después

```powershell
git add .
git commit -m "Descripción del cambio"
git push
```

Vercel actualiza automáticamente en 1-2 minutos.

## Notas importantes

⚠️ **Fotos grandes (>100MB):**
```powershell
git lfs install
git lfs track "fotos/*.jpg"
git add .gitattributes
git commit -m "Add Git LFS"
git push
```

⚠️ **Límites de Vercel (plan gratis):**
- ✅ Ancho de banda: 100GB/mes
- ✅ Builds: ilimitados
- ✅ Dominios: ilimitados
- ✅ HTTPS: incluido

## ¿Necesitas ayuda?

📖 Lee: `DEPLOYMENT_GUIDE.md` (guía completa paso a paso)
