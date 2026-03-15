# 🔧 TROUBLESHOOTING - Token RENIEC en Vercel

## ❌ Problema Actual

**Síntoma**: "No se encontró información para este DNI"  
**Causa**: Variable de entorno `RENIEC_TOKEN` no está siendo leída correctamente en Vercel

---

## ✅ SOLUCIÓN PASO A PASO

### 1️⃣ Verificar que el Token sea Correcto

El token debe ser **EXACTAMENTE** este (201 caracteres):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDU2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImNvbnN1bHRvciJ9.7XOL7Zqkz2OQoP7ezSsY3Z1EI6auekmtNDCBledqpQc
```

⚠️ **IMPORTANTE**: 
- NO debe tener espacios al inicio ni al final
- NO debe tener saltos de línea
- Debe copiarse TODO de una vez

---

### 2️⃣ Configurar en Vercel (PASO CRÍTICO)

#### A. Acceder a Settings

1. Ve a: https://vercel.com/dashboard
2. Click en tu proyecto: **mastergateway**
3. Click en **Settings** (icono ⚙️)
4. En el menú lateral izquierdo: **Environment Variables**

#### B. Verificar si ya existe

- Si ves `RENIEC_TOKEN` en la lista:
  1. Click en el botón de **editar** (lápiz ✏️)
  2. Click en **Delete** para borrarla
  3. Confirmar eliminación

#### C. Agregar Variable Nueva

1. Click en **Add New**

2. Llenar el formulario:
   ```
   Key (exactamente así, case-sensitive):
   RENIEC_TOKEN
   
   Value (copiar TODO el token):
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDU2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImNvbnN1bHRvciJ9.7XOL7Zqkz2OQoP7ezSsY3Z1EI6auekmtNDCBledqpQc
   
   Environments (SELECCIONAR TODOS):
   ✅ Production
   ✅ Preview  
   ✅ Development
   ```

3. Click en **Save**

---

### 3️⃣ Re-deploy COMPLETO

⚠️ **NO es suficiente con solo agregar la variable**, debes re-deployar:

#### Opción A: Re-deploy desde Deployments

1. Ve a la pestaña **Deployments**
2. Encuentra el deployment más reciente (el primero de la lista)
3. Click en el botón de **opciones** (tres puntos verticales ⋮)
4. Click en **Redeploy**
5. ✅ Asegúrate de marcar: **Use existing Build Cache** = NO (desmarcado)
6. Click en **Redeploy** nuevamente para confirmar

#### Opción B: Push nuevo commit (Recomendado)

```bash
# Subir los últimos cambios
cd d:\Downloads\UNAS-DNI\pagina_3\web_consulta
git add .
git commit -m "fix: Mejorar carga de variables de entorno para Vercel"
git push origin main
```

Vercel detectará el push y desplegará automáticamente con las nuevas variables.

---

### 4️⃣ Verificar que se Cargó Correctamente

#### A. Ver Logs de Deployment

1. Ve a **Deployments**
2. Click en el deployment más reciente
3. Click en **View Function Logs**
4. Busca en los logs:
   ```
   ✅ RENIEC_TOKEN cargado: eyJhbGciOiJIUzI1NiIsInR5...
   ```

Si ves esto, el token se cargó correctamente.

#### B. Probar en Producción

1. Ve a tu sitio: `https://mastergateway.vercel.app`
2. Busca el DNI: `62157895`
3. Deberías ver:
   ```
   🏛️ RENIEC
   Nombre: MIRANDA CARDENAS, DAVID ALEJANDRO
   Dirección: COMUNID.CAMPESINA VIZALLANI, PUNO - SAN ROMAN - CABANA
   ```

---

## 🔍 DIAGNÓSTICO DE PROBLEMAS

### Problema 1: "Servicio RENIEC no disponible (token no configurado)"

**Causa**: Vercel no puede leer `RENIEC_TOKEN`

**Solución**:
1. Verifica que el nombre sea EXACTAMENTE `RENIEC_TOKEN` (mayúsculas)
2. Verifica que esté en "Production" environment
3. Re-deploy SIN cache

### Problema 2: "Token de API inválido" (401)

**Causa**: El token es incorrecto o expiró

**Solución**:
1. Verifica que copiaste el token COMPLETO (201 caracteres)
2. Verifica en https://factiliza.com/dashboard que el token esté activo
3. Si expiró, genera uno nuevo y actualiza en Vercel

### Problema 3: "Error al consultar RENIEC" (500)

**Causa**: Error en la API de Factiliza

**Solución**:
1. Verifica que https://api.factiliza.com esté en línea
2. Verifica tu cuota de consultas en Factiliza
3. Espera unos minutos y vuelve a intentar

### Problema 4: Variable configurada pero no funciona

**Causa**: Cache de Vercel

**Solución**:
1. Borra el deployment antiguo
2. Re-deploy sin usar cache:
   - Deployments → ⋮ → Redeploy
   - ❌ DESMARCA "Use existing Build Cache"
   - Redeploy

---

## 📝 CHECKLIST COMPLETO

Antes de contactar soporte, verifica:

- [ ] Variable se llama exactamente `RENIEC_TOKEN` (case-sensitive)
- [ ] Token tiene 201 caracteres
- [ ] Token no tiene espacios ni saltos de línea
- [ ] Variable está en **Production** environment
- [ ] Variable está en **Preview** environment
- [ ] Variable está en **Development** environment
- [ ] Hiciste re-deploy DESPUÉS de agregar la variable
- [ ] Re-deploy fue SIN cache
- [ ] Esperaste 2-3 minutos después del re-deploy
- [ ] Probaste con el DNI: 62157895
- [ ] Revisaste los Function Logs

---

## 🆘 SI AÚN NO FUNCIONA

### Opción 1: Hardcodear temporalmente (SOLO PARA DEBUG)

**⚠️ NO RECOMENDADO PARA PRODUCCIÓN**

En `server.py` línea 27, cambia:

```python
# ANTES
RENIEC_TOKEN = os.getenv('RENIEC_TOKEN')

# DESPUÉS (temporal para debug)
RENIEC_TOKEN = os.getenv('RENIEC_TOKEN') or 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDU2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImNvbnN1bHRvciJ9.7XOL7Zqkz2OQoP7ezSsY3Z1EI6auekmtNDCBledqpQc'
```

Esto usará el token hardcodeado si no encuentra la variable de entorno.

**⚠️ RECUERDA**: Esto es TEMPORAL. Una vez que funcione, elimina el token hardcodeado.

### Opción 2: Usar Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Agregar variable
vercel env add RENIEC_TOKEN
# Cuando pregunte, pegar el token
# Seleccionar: Production, Preview, Development

# Re-deploy
vercel --prod
```

---

## 📞 SOPORTE

### Vercel Support
- Twitter: @vercel
- Discord: https://vercel.com/discord
- Docs: https://vercel.com/docs/projects/environment-variables

### API Factiliza
- Email: soporte@factiliza.com
- Dashboard: https://factiliza.com/dashboard

---

**Última actualización**: 14 de Marzo de 2026  
**Versión**: 2.0 - Troubleshooting Guide
