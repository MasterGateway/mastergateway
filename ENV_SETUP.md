# 🔐 Configuración de Variables de Entorno

Este documento explica cómo configurar las variables de entorno necesarias para el sistema de consulta dual (Base de Datos Local + API RENIEC).

## 📋 Variables Requeridas

El archivo `.env` debe contener el token de autenticación para la API de Factiliza/RENIEC:

```env
RENIEC_TOKEN=tu_token_de_factiliza_aqui
```

## 🚀 Configuración en Vercel

Para que la aplicación funcione correctamente en producción, debes configurar las variables de entorno en Vercel:

### Paso 1: Acceder a Configuración del Proyecto

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto **mastergateway**
3. Click en **Settings** (⚙️)

### Paso 2: Configurar Variables de Entorno

1. En el menú lateral, selecciona **Environment Variables**
2. Agrega las siguientes variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `RENIEC_TOKEN` | Tu token de Factiliza | Production, Preview, Development |

### Paso 3: Re-deploy

Después de agregar las variables de entorno:

1. Ve a la pestaña **Deployments**
2. Selecciona el último deployment
3. Click en el botón de opciones (⋮)
4. Selecciona **Redeploy**

## 🔒 Seguridad

⚠️ **IMPORTANTE**: 

- **NUNCA** subas el archivo `.env` a GitHub
- El `.env` está incluido en `.gitignore` para prevenir exposición accidental
- Cada desarrollador debe crear su propio archivo `.env` localmente
- En producción, usa las variables de entorno de Vercel

## 🧪 Configuración Local

Para desarrollo local:

1. Crea un archivo `.env` en la carpeta raíz (`pagina_3/`)
2. Agrega tu token:
   ```env
   RENIEC_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Guarda el archivo
4. Ejecuta el servidor:
   ```bash
   cd web_consulta
   python server.py
   ```

## 📡 API de Factiliza

### Endpoint de Consulta

```bash
curl --request GET \
  --url https://api.factiliza.com/v1/dni/info/{dni} \
  --header 'Authorization: Bearer <tu_token>'
```

### Ejemplo de Respuesta

```json
{
  "numero": "61020080",
  "codigo_verificacion": "5",
  "nombres": "ANGHELINA YARIS",
  "apellido_paterno": "ROJAS",
  "apellido_materno": "AYALA",
  "nombre_completo": "ROJAS AYALA, ANGHELINA YARIS",
  "departamento": "HUANUCO",
  "provincia": "LEONCIO PRADO",
  "distrito": "SANTO DOMINGO DE ANDA",
  "direccion": "CASERIO ARABE",
  "direccion_completa": "CASERIO ARABE, HUANUCO - LEONCIO PRADO - SANTO DOMINGO DE ANDA",
  "ubigeo_reniec": "090610",
  "ubigeo_sunat": "100610",
  "ubigeo": ["10", "1006", "100610"],
  "fecha_nacimiento": "",
  "estado_civil": "",
  "foto": "",
  "sexo": ""
}
```

## 🎯 Funcionalidad Dual

El sistema ahora detecta automáticamente el tipo de búsqueda:

### Búsqueda por Código (Base Local)
- Formato: `0020240001` (10 dígitos)
- Fuente: `estudiantes.json`
- Incluye: Foto local, email, teléfono, año ingreso

### Búsqueda por DNI (API RENIEC)
- Formato: `61020080` (8 dígitos)
- Fuente: API de Factiliza
- Incluye: Datos RENIEC (dirección completa, ubigeo, estado civil)

## 🔧 Troubleshooting

### Error: "Token no configurado"
- Verifica que `RENIEC_TOKEN` esté en el archivo `.env`
- En Vercel, verifica que la variable de entorno esté configurada
- Re-deploy después de agregar variables

### Error: "DNI no encontrado"
- El DNI puede no existir en la base de datos de RENIEC
- Verifica que el DNI tenga exactamente 8 dígitos
- Prueba con otro DNI válido

### Error: "Too many requests"
- El rate limiting está activo (20 consultas/minuto)
- Espera 1 minuto antes de volver a intentar
- Contacta al administrador si necesitas un límite mayor

## 📞 Soporte

Para obtener un token de API de Factiliza:
- Visita: https://factiliza.com
- Crea una cuenta
- Genera tu token de API en el panel de control
- Copia el token y agrégalo a tus variables de entorno

---

**Última actualización**: Marzo 2026  
**Versión**: 2.0 - Sistema de Consulta Dual
