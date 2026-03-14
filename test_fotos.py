import json

with open('estudiantes.json', encoding='utf-8') as f:
    data = json.load(f)

# Buscar estudiantes con fotos
estudiantes_con_foto = [e for e in data['estudiantes'] if e.get('foto_local') and e['codigo'].startswith('002024')]

print(f"\n✅ Total estudiantes con fotos (código 002024xxx): {len(estudiantes_con_foto)}\n")

# Mostrar los primeros 5
for i, e in enumerate(estudiantes_con_foto[:5], 1):
    foto_nombre = e['foto_local'].split('\\')[-1] if '\\' in e['foto_local'] else e['foto_local'].split('/')[-1]
    print(f"{i}. {e['codigo']} - {e['nombres_completo'][:40]}")
    print(f"   Foto: {foto_nombre}")
    print(f"   Estado: {e['estado_foto']}\n")
