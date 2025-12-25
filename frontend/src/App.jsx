import { useState, useEffect } from 'react';
import { fetchStudies } from './services/api';
import MetricsDashboard from './components/MetricsDashboard';
import StudyForm from './components/StudyForm';
import StudiesList from './components/StudiesList';

function App() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStudies = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchStudies();
      setStudies(data);
    } catch (err) {
      setError('Error al cargar los estudios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Dashboard de Estudios Médicos
        </h1>
        
        <MetricsDashboard studies={studies} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StudyForm onStudyCreated={loadStudies} />
          </div>
          
          <div className="lg:col-span-2">
            <StudiesList 
              studies={studies} 
              loading={loading} 
              error={error}
              onStudyUpdated={loadStudies}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
