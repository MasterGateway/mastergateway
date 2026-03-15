# ⚙️ Configuración de Variables de Entorno en Vercel

## 🚀 Pasos para Configurar

### 1. Acceder al Dashboard de Vercel
```
https://vercel.com/dashboard
```

### 2. Seleccionar el Proyecto
- Click en **mastergateway**

### 3. Ir a Settings
- Click en **Settings** (⚙️)
- En el menú lateral: **Environment Variables**

### 4. Agregar Variable de Entorno

#### Variable: RENIEC_TOKEN
```
Name: RENIEC_TOKEN
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDU2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImNvbnN1bHRvciJ9.7XOL7Zqkz2OQoP7ezSsY3Z1EI6auekmtNDCBledqpQc
Environment: Production, Preview, Development (seleccionar todos)
```

### 5. Guardar
- Click en **Add**

### 6. Re-deploy
- Ve a la pestaña **Deployments**
- Selecciona el último deployment
- Click en el botón de opciones (⋮)
- Click en **Redeploy**

### 7. Verificar
Espera 2-3 minutos y prueba:
- Buscar por código: `0020240001` → Base local
- Buscar por DNI: `62157895` → API RENIEC

---

## 📝 Notas Importantes

### ⚠️ CRÍTICO
- **NO** borrar el archivo `.env` local (necesario para desarrollo)
- **NO** subir `.env` a GitHub (ya está en `.gitignore`)
- El token en Vercel debe ser **exactamente** el mismo que en `.env` local

### ✅ Variables Configuradas
- `RENIEC_TOKEN`: Token de API de Factiliza

### 🔄 Auto-Deploy
Vercel detecta automáticamente los cambios en GitHub y despliega:
- Cada `git push` → Auto-deploy en ~2 minutos

---

## 🧪 Testing Post-Deploy

### Prueba 1: Búsqueda por Código
```
Input: 0020240001
Esperado: Datos del estudiante UNAS (base local)
```

### Prueba 2: Búsqueda por DNI
```
Input: 62157895
Esperado: 
  Badge: 🏛️ RENIEC
  Nombre: MIRANDA CARDENAS, DAVID ALEJANDRO
  Dirección: COMUNID.CAMPESINA VIZALLANI, PUNO - SAN ROMAN - CABANA
```

### Prueba 3: DNI No Encontrado
```
Input: 12345678
Esperado: Mensaje "DNI no encontrado en RENIEC"
```

---

## 🔧 Troubleshooting

### Error: "Error al consultar RENIEC"
**Causa**: Token no configurado o inválido  
**Solución**: 
1. Verificar que `RENIEC_TOKEN` esté en Environment Variables
2. Verificar que el token sea correcto (copiar/pegar completo)
3. Re-deploy después de agregar/modificar

### Error: "Rate limit exceeded"
**Causa**: Más de 20 consultas/minuto  
**Solución**: Esperar 1 minuto y volver a intentar

### Búsqueda por DNI no funciona
**Causa**: Variable de entorno no cargada  
**Solución**:
1. Verificar en Settings → Environment Variables
2. Verificar que esté en "Production"
3. Re-deploy forzado

---

## 📞 Soporte

### Vercel Support
- Docs: https://vercel.com/docs/concepts/projects/environment-variables
- Support: https://vercel.com/support

### API Factiliza
- Dashboard: https://factiliza.com/dashboard
- Docs: https://api.factiliza.com/docs

---

**Última actualización**: 14 de Marzo de 2026  
**Commit**: feat: Integración completa de API RENIEC  
**Hash**: 457140c
