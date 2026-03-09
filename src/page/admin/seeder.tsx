import { useState } from 'react';
import { seedRestaurantRequests, getAvailableSeeds } from '../../features/restaurantRequest/seeder';
import { useAuth } from '../../features/auth/AuthContext';

export function SeederPage() {
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  const handleSeedAll = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('Seeding in progress...');
      setLogs(['🌱 Starting seeder...']);
      setLogs(prev => [...prev, `👤 User: ${user?.uid ?? 'N/A'}`, `🛡️ Role: ${role ?? 'N/A'}`]);

      const result = await seedRestaurantRequests();

      const summary = [
        `✅ Success: ${result.successCount}`,
        `❌ Failed: ${result.failureCount}`,
      ];

      const failureLogs = result.failures.map(
        (f) => `ERROR: ${f.restaurantName} -> ${f.code ? `${f.code} - ` : ''}${f.message}`
      );

      setLogs(prev => [...prev, ...summary, ...failureLogs]);
      setMessage(`✅ Done. Added ${result.successCount} request(s).`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to seed data: ${errorMsg}`);
      setLogs(prev => [...prev, `ERROR: ${errorMsg}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">🌱 Restaurant Seeder</h1>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Seed restaurant requests into Firebase:
          </p>
          
          <ul className="bg-gray-50 p-4 rounded text-sm space-y-2">
            {getAvailableSeeds().map((name) => (
              <li key={name} className="text-gray-700">• {name}</li>
            ))}
          </ul>

          <button
            onClick={handleSeedAll}
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Seeding...' : 'Seed Restaurant Requests'}
          </button>

          {/* Logs Display */}
          <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs max-h-64 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, idx) => (
                <div key={idx} className={log.includes('ERROR') ? 'text-red-400' : log.includes('✅') ? 'text-green-400' : ''}>
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-500">Logs will appear here...</div>
            )}
          </div>

          {message && (
            <div className="p-3 bg-green-100 text-green-700 rounded text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
