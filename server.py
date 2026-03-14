from flask import Flask, render_template, jsonify, request, send_from_directory, session
from flask_cors import CORS
import json
import os
from pathlib import Path
from difflib import get_close_matches
import base64
import secrets
import hashlib
from datetime import datetime, timedelta

# Get the base directory
BASE_DIR = Path(__file__).resolve().parent

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)  # Secret key for sessions
CORS(app)

# Security: Rate limiting storage
request_tracker = {}

def check_rate_limit(identifier, max_requests=30, window_seconds=60):
    """Simple rate limiting"""
    now = datetime.now()
    
    # Clean old entries
    expired = [k for k, v in request_tracker.items() if now - v['time'] > timedelta(seconds=window_seconds)]
    for k in expired:
        del request_tracker[k]
    
    # Check rate
    if identifier in request_tracker:
        if request_tracker[identifier]['count'] >= max_requests:
            return False
        request_tracker[identifier]['count'] += 1
    else:
        request_tracker[identifier] = {'count': 1, 'time': now}
    
    return True

def simple_encrypt(data):
    """Simple obfuscation using base64"""
    json_str = json.dumps(data)
    encoded = base64.b64encode(json_str.encode('utf-8')).decode('utf-8')
    return encoded

def simple_decrypt(data):
    """Simple deobfuscation"""
    try:
        decoded = base64.b64decode(data.encode('utf-8')).decode('utf-8')
        return json.loads(decoded)
    except:
        return None

# Cargar datos de estudiantes
def cargar_estudiantes():
    try:
        json_path = BASE_DIR / 'estudiantes.json'
        print(f"Intentando cargar: {json_path}")
        print(f"Archivo existe: {json_path.exists()}")
        
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"Estudiantes cargados: {data.get('total', 0)}")
            return data
    except Exception as e:
        print(f"Error al cargar estudiantes: {e}")
        import traceback
        traceback.print_exc()
        return {"estudiantes": [], "total": 0, "error": str(e)}

estudiantes_data = cargar_estudiantes()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/health')
def health():
    """Endpoint de diagnóstico"""
    return jsonify({
        "status": "ok",
        "estudiantes_cargados": estudiantes_data.get('total', 0),
        "tiene_datos": len(estudiantes_data.get('estudiantes', [])) > 0,
        "base_dir": str(BASE_DIR),
        "json_exists": (BASE_DIR / 'estudiantes.json').exists(),
        "fotos_dir_exists": (BASE_DIR / 'fotos').exists(),
        "version": "1.0.0"
    })

# SECURITY: Obfuscated endpoints with hashed names
@app.route('/api/x7f9k2')  # was /api/estudiantes
def get_estudiantes():
    """Devuelve metadata (NO todos los estudiantes)"""
    # Rate limiting
    client_ip = request.remote_addr
    if not check_rate_limit(f"meta_{client_ip}", max_requests=10, window_seconds=60):
        return jsonify({"error": "Demasiadas solicitudes"}), 429
    
    # Solo devolver metadata, NO los estudiantes completos
    metadata = {
        "total": estudiantes_data.get('total', 0),
        "ultima_actualizacion": estudiantes_data.get('ultima_actualizacion', ''),
        "status": "ok"
    }
    
    # Encriptar respuesta
    encrypted = simple_encrypt(metadata)
    return jsonify({"d": encrypted})

@app.route('/api/q5m8n1')  # was /api/buscar
def buscar():
    """Busca estudiantes por término - ENCRIPTADO"""
    # Rate limiting
    client_ip = request.remote_addr
    if not check_rate_limit(f"search_{client_ip}", max_requests=30, window_seconds=60):
        return jsonify({"error": "Demasiadas solicitudes"}), 429
    
    termino = request.args.get('q', '').lower().strip()
    
    if not termino:
        return jsonify({"resultados": [], "total": 0})
    
    resultados = []
    for estudiante in estudiantes_data.get('estudiantes', []):
        nombre = estudiante.get('nombres_completo', '').lower()
        dni = estudiante.get('dni', '').lower()
        codigo = estudiante.get('codigo', '').lower()
        
        if termino in nombre or termino in dni or termino in codigo:
            resultados.append(estudiante)
    
    # Encriptar resultados
    response_data = {
        "resultados": resultados,
        "total": len(resultados),
        "termino": termino
    }
    encrypted = simple_encrypt(response_data)
    return jsonify({"d": encrypted})

@app.route('/api/s3r7v9')  # was /api/sugerencias
def sugerencias():
    """Devuelve sugerencias de autocompletado - ENCRIPTADO"""
    # Rate limiting
    client_ip = request.remote_addr
    if not check_rate_limit(f"suggest_{client_ip}", max_requests=50, window_seconds=60):
        return jsonify({"error": "Too many requests"}), 429
    
    termino = request.args.get('q', '').lower().strip()
    limite = int(request.args.get('limit', 10))
    
    if not termino or len(termino) < 2:
        encrypted = simple_encrypt({"sugerencias": []})
        return jsonify({"d": encrypted})
    
    sugerencias_list = []
    
    for estudiante in estudiantes_data.get('estudiantes', []):
        nombre = estudiante.get('nombres_completo', '')
        dni = estudiante.get('dni', '')
        codigo = estudiante.get('codigo', '')
        
        # Buscar coincidencias
        if termino in nombre.lower():
            sugerencias_list.append({
                "texto": nombre,
                "tipo": "nombre",
                "valor": nombre,
                "dni": dni,
                "codigo": codigo
            })
        elif termino in dni.lower():
            sugerencias_list.append({
                "texto": f"{nombre} (DNI: {dni})",
                "tipo": "dni",
                "valor": dni,
                "nombre": nombre,
                "codigo": codigo
            })
        elif termino in codigo.lower():
            sugerencias_list.append({
                "texto": f"{nombre} (Código: {codigo})",
                "tipo": "codigo",
                "valor": codigo,
                "nombre": nombre,
                "dni": dni
            })
        
        if len(sugerencias_list) >= limite:
            break
    
    # Encriptar sugerencias
    encrypted = simple_encrypt({"sugerencias": sugerencias_list[:limite]})
    return jsonify({"d": encrypted})

@app.route('/api/estadisticas')
def estadisticas():
    """Devuelve estadísticas generales"""
    total = estudiantes_data.get('total', 0)
    con_fotos = sum(1 for e in estudiantes_data.get('estudiantes', []) 
                    if e.get('foto_local') and e.get('estado_foto') != 'No se encontró foto')
    
    return jsonify({
        "total_estudiantes": total,
        "con_fotos": con_fotos,
        "sin_fotos": total - con_fotos,
        "ultima_actualizacion": estudiantes_data.get('ultima_actualizacion', 'N/A')
    })

@app.route('/fotos/<path:filename>')
def servir_foto(filename):
    """Sirve las fotos de los estudiantes"""
    fotos_dir = BASE_DIR / 'fotos'
    print(f"Sirviendo foto: {filename} desde {fotos_dir}")
    return send_from_directory(str(fotos_dir), filename)

@app.route('/static/<path:filename>')
def servir_static(filename):
    """Sirve archivos estáticos"""
    static_dir = BASE_DIR / 'static'
    return send_from_directory(str(static_dir), filename)

# Para Vercel (exportar la app)
app = app

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 MasterGateway - Sistema Inteligente de Consulta")
    print("=" * 60)
    print(f"📊 Total de registros cargados: {estudiantes_data.get('total', 0)}")
    print(f"🌐 Servidor corriendo en: http://localhost:5000")
    print("=" * 60)
    print("\n✨ Características:")
    print("  🔍 Búsqueda inteligente")
    print("  💡 Autocompletado en tiempo real")
    print("  🗣️  Bot con síntesis de voz")
    print("  📸 Visualización de fotos")
    print("  🔒 Protección avanzada")
    print("\n⚠️  Presiona CTRL+C para detener el servidor\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
