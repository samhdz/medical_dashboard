import { useState } from 'react';
import { completeStudy } from '../services/api';

function StudiesList({ studies, loading, error, onStudyUpdated }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState(null);

  const filteredStudies = studies.filter(study =>
    study.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleComplete = async (id) => {
    setUpdating(id);
    try {
      await completeStudy(id);
      onStudyUpdated();
    } catch (error) {
      alert('Error al marcar estudio como completado');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">Cargando estudios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Lista de Estudios</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-2">
          Mostrando {filteredStudies.length} de {studies.length} estudios
        </p>
      </div>

      {filteredStudies.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No se encontraron estudios</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudies.map((study) => (
                <tr key={study.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {study.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {study.patient_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {study.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      study.status === 'pendiente' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {study.status === 'pendiente' ? 'Pendiente' : 'Completado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {study.status === 'pendiente' ? (
                      <button
                        onClick={() => handleComplete(study.id)}
                        disabled={updating === study.id}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {updating === study.id ? 'Actualizando...' : 'Marcar como Completado'}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-300 text-gray-500 px-3 py-1 rounded cursor-not-allowed"
                      >
                        Completado
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudiesList;
