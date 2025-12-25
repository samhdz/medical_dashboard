import { useState } from 'react';
import { createStudy } from '../services/api';

function StudyForm({ onStudyCreated }) {
  const [formData, setFormData] = useState({
    patient_name: '',
    type: '',
    status: 'pendiente'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const studyTypes = [
    'Tomografía',
    'Resonancia',
    'Rayos X',
    'Ecografía',
    'Análisis de Sangre'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patient_name || !formData.type) {
      setMessage({ text: 'Todos los campos son obligatorios', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await createStudy(formData);
      setMessage({ text: 'Estudio agregado exitosamente', type: 'success' });
      setFormData({ patient_name: '', type: '', status: 'pendiente' });
      onStudyCreated();
    } catch (error) {
      setMessage({ text: 'Error al crear estudio', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Agregar Nuevo Estudio</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Paciente
          </label>
          <input
            type="text"
            value={formData.patient_name}
            onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el nombre del paciente"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Estudio
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione un tipo</option>
            {studyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pendiente">Pendiente</option>
            <option value="completado">Completado</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Agregando...' : 'Agregar Estudio'}
        </button>

        {message.text && (
          <div className={`p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}

export default StudyForm;
