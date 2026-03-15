#!/usr/bin/env python3
"""
Script de verificación de conexión con API de Factiliza
"""
import os
import sys
import requests
import json
from dotenv import load_dotenv
from pathlib import Path

# Colores para terminal
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def test_reniec_api():
    """Prueba la conexión con la API de RENIEC"""
    
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}🔍 TEST DE CONEXIÓN - API RENIEC/FACTILIZA{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    # Cargar variables de entorno
    BASE_DIR = Path(__file__).resolve().parent
    env_path = BASE_DIR / '.env'
    
    if env_path.exists():
        load_dotenv(env_path)
        print(f"{GREEN}✅ Archivo .env encontrado{RESET}")
    else:
        print(f"{RED}❌ Archivo .env NO encontrado en: {env_path}{RESET}")
        return False
    
    # Obtener token
    token = os.getenv('RENIEC_TOKEN')
    
    if not token:
        print(f"{RED}❌ RENIEC_TOKEN no está configurado en .env{RESET}")
        return False
    
    print(f"{GREEN}✅ RENIEC_TOKEN cargado{RESET}")
    print(f"   Token (primeros 30 caracteres): {token[:30]}...")
    print(f"   Longitud total: {len(token)} caracteres\n")
    
    # DNI de prueba
    dni_test = "62157895"
    url = f"https://api.factiliza.com/v1/dni/info/{dni_test}"
    
    print(f"{BLUE}📡 Probando conexión...{RESET}")
    print(f"   URL: {url}")
    print(f"   DNI de prueba: {dni_test}\n")
    
    try:
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print(f"{GREEN}✅ CONEXIÓN EXITOSA{RESET}\n")
            
            data = response.json()
            print(f"{BLUE}📊 Respuesta de la API:{RESET}")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            
            # Verificar estructura
            if 'data' in data:
                reniec_data = data['data']
                print(f"\n{GREEN}✅ Estructura de datos correcta{RESET}")
                print(f"   Nombre: {reniec_data.get('nombre_completo', 'N/A')}")
                print(f"   DNI: {reniec_data.get('numero', 'N/A')}")
                print(f"   Dirección: {reniec_data.get('direccion_completa', 'N/A')}")
            
            return True
            
        elif response.status_code == 401:
            print(f"{RED}❌ ERROR DE AUTENTICACIÓN (401){RESET}")
            print(f"   El token es inválido o ha expirado")
            print(f"   Respuesta: {response.text[:200]}")
            return False
            
        elif response.status_code == 404:
            print(f"{YELLOW}⚠️ DNI NO ENCONTRADO (404){RESET}")
            print(f"   El DNI {dni_test} no existe en la base de datos RENIEC")
            print(f"   Pero la conexión con la API es correcta")
            return True
            
        else:
            print(f"{RED}❌ ERROR INESPERADO ({response.status_code}){RESET}")
            print(f"   Respuesta: {response.text[:200]}")
            return False
            
    except requests.Timeout:
        print(f"{RED}❌ TIMEOUT{RESET}")
        print(f"   La API no respondió en 10 segundos")
        return False
        
    except requests.RequestException as e:
        print(f"{RED}❌ ERROR DE CONEXIÓN{RESET}")
        print(f"   {str(e)}")
        return False
        
    except Exception as e:
        print(f"{RED}❌ ERROR INESPERADO{RESET}")
        print(f"   {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def main():
    success = test_reniec_api()
    
    print(f"\n{BLUE}{'='*60}{RESET}")
    if success:
        print(f"{GREEN}✅ PRUEBA EXITOSA - API FUNCIONANDO CORRECTAMENTE{RESET}")
        print(f"\n{BLUE}📝 Próximos pasos:{RESET}")
        print(f"   1. Subir cambios a GitHub: git push")
        print(f"   2. Configurar RENIEC_TOKEN en Vercel")
        print(f"   3. Re-deploy en Vercel")
    else:
        print(f"{RED}❌ PRUEBA FALLIDA - REVISAR CONFIGURACIÓN{RESET}")
        print(f"\n{YELLOW}📝 Acciones recomendadas:{RESET}")
        print(f"   1. Verificar que el archivo .env existe")
        print(f"   2. Verificar que RENIEC_TOKEN esté configurado")
        print(f"   3. Verificar que el token sea válido en factiliza.com")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
