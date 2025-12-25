import { useState, useEffect } from 'react';

function MetricsDashboard({ studies }) {
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    createdToday: 0,
    completedToday: 0
  });

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = studies.length;
    const pending = studies.filter(s => s.status === 'pendiente').length;
    const completed = studies.filter(s => s.status === 'completado').length;
    
    const createdToday = studies.filter(s => {
      const createdDate = new Date(s.created_at);
      createdDate.setHours(0, 0, 0, 0);
      return createdDate.getTime() === today.getTime();
    }).length;

    const completedToday = studies.filter(s => {
      if (!s.completed_at) return false;
      const completedDate = new Date(s.completed_at);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    }).length;

    setMetrics({ total, pending, completed, createdToday, completedToday });
  }, [studies]);

  const getBalanceIndicator = () => {
    const diff = metrics.createdToday - metrics.completedToday;
    // Se utiliza una escala de colores básica para representar el atraso entre estudios completados vs. creados hoy.
    if (diff > (metrics.createdToday / 2)){
      return {
        text: `+${diff} estudios acumulados hoy`,
        color: 'text-red-600',
        emoji: '🔴'
      };
    }
    if (diff > 0) {
      return {
        text: `${diff} estudios acumulados hoy`,
        color: 'text-orange-600',
        emoji: '🟠'
      };
    } else if (diff < 0) {
      return {
        text: `${diff} estudios reducidos`,
        color: 'text-green-600',
        emoji: '🟢'
      };
    } else {
      return {
        text: 'Equilibrado',
        color: 'text-yellow-600',
        emoji: '🟡'
      };
    }
  };

  const balance = getBalanceIndicator();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium">Total de Estudios</h3>
        <p className="text-3xl font-bold text-blue-600 mt-2">{metrics.total}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium">Pendientes</h3>
        <p className="text-3xl font-bold text-orange-600 mt-2">{metrics.pending}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium">Completados</h3>
        <p className="text-3xl font-bold text-green-600 mt-2">{metrics.completed}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium">Balance del Día</h3>
        <p className="text-sm text-gray-600 mt-2">
          Creados hoy: {metrics.createdToday} | Completados hoy: {metrics.completedToday}
        </p>
        <p className={`text-sm font-semibold mt-1 ${balance.color}`}>
          {balance.emoji} {balance.text}
        </p>
      </div>
    </div>
  );
}

export default MetricsDashboard;
