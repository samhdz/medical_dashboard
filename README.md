# Dashboard de Estudios Médicos

Mini dashboard para gestionar estudios médicos con métricas en tiempo real y seguimiento de backlog.

**Tecnologías:**
- Backend: FastAPI + SQLAlchemy + SQLite
- Frontend: React + Vite + Tailwind CSS

## Características

### Requisitos
- ✅ Listar todos los estudios médicos con información del paciente
- ✅ Crear nuevos estudios médicos
- ✅ Mostrar dashboard de métricas (Total, Pendientes, Completados)
- ✅ Actualización automática de datos después de operaciones
- ✅ **Búsqueda de pacientes** - Filtrado en tiempo real por nombre de paciente

### Características extra
- Endpoint PATCH para marcar estudios como completados
- Indicador "Balance del día" para mostrar progreso neto diario en la carga de trabajo (creados vs completados)
## Instalación y Ejecución

### Prerequisitos
- Python 3.9+
- Node.js 16+
- npm o yarn

### Inicio Rápido (Recomendado)

**Opción 1: Script de Despliegue Automatizado**

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
- ✅ Verifica la instalación de Python y Node.js
- ✅ Crea el entorno virtual para el backend
- ✅ Instala todas las dependencias (backend y frontend)
- ✅ Crea el archivo .env desde la plantilla
- ✅ Inicia ambos servidores (backend y frontend)

**Opción 2: Scripts Individuales**

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

### Configuración Manual

**Configuración del Backend**
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

**Configuración del Frontend**
```bash
cd frontend
npm install
npm run dev
```
El frontend se ejecuta en: http://localhost:5173

### Acceder a la Aplicación
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **Documentación API:** http://localhost:8000/docs

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

## Tecnologías Utilizadas

- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Base de Datos**: SQLite (desarrollo)

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
