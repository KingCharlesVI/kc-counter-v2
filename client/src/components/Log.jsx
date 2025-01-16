function Log({ logs, loading }) {
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">Times KC was late or never returned</h2>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {logs.length === 0 ? (
          <p className="text-gray-500">No instances recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div 
                key={log.id}
                className="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <p className="text-lg">
                  <span className="font-semibold">Count: {log.count}</span>
                  <span className="text-gray-500 ml-4">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Log