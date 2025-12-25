# Dashboard de Estudios Médicos

Mini dashboard para gestionar estudios médicos con métricas en tiempo real y seguimiento de backlog.

**Tecnologías:**
- Backend: FastAPI + SQLAlchemy + SQLite
- Frontend: React + Vite + Tailwind CSS

## Navegación Rápida

- [Características](#características)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Decisiones Funcionales y Técnicas](#decisiones-funcionales-y-técnicas)

## Características

### Requisitos
-  Listar todos los estudios médicos con información del paciente
-  Crear nuevos estudios médicos
-  Mostrar dashboard de métricas (Total, Pendientes, Completados)
-  Actualización automática de métricas después de cada acción.

### Características extra
- Endpoint PATCH para marcar estudios como completados
- Filtrado de listado de estudios por nombre de paciente
- Indicador "Balance del día" para mostrar progreso neto diario en la carga de trabajo (creados vs completados)

### Puntos de mejora a futuro (no implementados)
#### Funcionales:
- Agregar más datos al dashboard (estudios completados y pendientes por tipo). Esto agrega valor permitiendo que el usuario analista pueda decidir si incorporar más recursos en algún área del laboratorio.
- Separar el dashboard del registro y ejecución de estudios. Se interpreta que en general estas tareas las harán personas distintas.
- Agregar estados adicionales, el modelo actual asume que todo estudio pendiente se completa eventualmente, cuando es posible que un estudio se cancele o no pueda ejecutarse.
### Técnicos: 
- Normalizar la estructura de tablas (mover el tipo de estudio a una tabla de catálogo)
- Centralizar configuración de puertos y acceso a base de datos en un único archivo.
## Instalación y ejecución

### Prerequisitos
- Python 3.9+
- Node.js 16+
- npm

### Quickstart

**Script de despliegue (centralizado)**

En todos los casos, ejecutar comandos desde el directorio base del proyecto.

**Para Windows:**
```bash
./deploy.bat
```

**Para Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

Este script:
-  Verifica la instalación de Python y Node.js
-  Crea el entorno virtual para el backend
-  Instala todas las dependencias (backend y frontend)
-  Crea el archivo .env desde la plantilla
-  Inicia ambos servidores (backend y frontend)

### Acceder a la aplicación
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **Documentación API (generada automáticamente):** http://localhost:8000/docs


**Scripts auxiliares**

Iniciar solo el backend:
```bash
# Windows
start-backend.bat

# Linux/Mac
chmod +x start-backend.sh
./start-backend.sh
```

Iniciar solo el frontend:
```bash
# Windows
start-frontend.bat

# Linux/Mac
chmod +x start-frontend.sh
./start-frontend.sh
```

Si se desea revisar el despliegue a nivel más granular, ver sección Despliegue manual.

## Decisiones funcionales y técnicas
- Me incliné por el uso de SQLite para tener cierta persistencia sin el costo de configuración y despliegue de un servidor de bases de datos. En un entorno productivo optaría por una solución más robusta y escalable como PostgreSQL (asumiendo que el costo de desplegar esta herramienta se pueda justificar).
- Decidí generar scripts de despliegue para facilitar la revisión del proyecto (por favor alertarme si hay algún problema para desplegar el proyecto!).
- Agregué el endpoint PATCH para "cerrar el flujo de trabajo", entendiendo que en general quien va a registrar un estudio lo registrará como "Pendiente" y no como "Completado". El pasaje de estado a "Completado" lo hará el ejecutor del estudio una vez finalizada la intervención. 

## Estructura del Proyecto

```
medical-studies-dashboard/
├── backend/
│   ├── main.py           # API endpoints
│   ├── models.py         # Modelos SQLAlchemy
│   ├── schemas.py        # Schemas Pydantic
│   ├── database.py       # Configuración de BD
│   └── requirements.txt  # Dependencias Python
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/   # Componentes React
│   │   └── services/     # API client
│   └── package.json      # Dependencias Node
└── README.md
```

## Endpoints de la API

### GET /studies
Retorna la lista de estudios médicos relevantes (pendientes + completados hoy).

**Filtrado**: Solo retorna estudios que son actualmente accionables o representan el trabajo de hoy:
- Todos los estudios con `status == 'pendiente'`
- Estudios con `status == 'completado'` donde `completed_at` es hoy

**Respuesta:** `200 OK`
```json
[
  {
    "id": 1,
    "patient_name": "Juan Pérez",
    "type": "Tomografía",
    "status": "pendiente",
    "created_at": "2024-12-23T10:30:00",
    "completed_at": null
  }
]
```

### POST /studies
Crea un nuevo estudio médico.

**Cuerpo de la Solicitud:**
```json
{
  "patient_name": "Nuevo Paciente",
  "type": "Rayos X",
  "status": "pendiente"
}
```

**Respuesta:** `201 Created`

### PATCH /studies/{id}
Marca un estudio como completado.

**Cuerpo de la Solicitud:**
```json
{
  "status": "completado"
}
```

**Respuesta:** `200 OK` | `404 Not Found`


## Despliegue manual

**Backend**
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```
El backend se ejecuta en: http://localhost:8000

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
El frontend se ejecuta en: http://localhost:5173
