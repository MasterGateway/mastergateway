from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os
from difflib import get_close_matches

app = Flask(__name__)
CORS(app)

# Cargar datos de estudiantes
def cargar_estudiantes():
    try:
        with open('estudiantes.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error al cargar estudiantes: {e}")
        return {"estudiantes": [], "total": 0}

estudiantes_data = cargar_estudiantes()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/estudiantes')
def get_estudiantes():
    """Devuelve todos los estudiantes"""
    return jsonify(estudiantes_data)

@app.route('/api/buscar')
def buscar():
    """Busca estudiantes por término"""
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
    
    return jsonify({
        "resultados": resultados,
        "total": len(resultados),
        "termino": termino
    })

@app.route('/api/sugerencias')
def sugerencias():
    """Devuelve sugerencias de autocompletado"""
    termino = request.args.get('q', '').lower().strip()
    limite = int(request.args.get('limit', 10))
    
    if not termino or len(termino) < 2:
        return jsonify({"sugerencias": []})
    
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
    
    return jsonify({"sugerencias": sugerencias_list[:limite]})

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
    return send_from_directory('fotos', filename)

@app.route('/static/<path:filename>')
def servir_static(filename):
    """Sirve archivos estáticos"""
    return send_from_directory('static', filename)

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
