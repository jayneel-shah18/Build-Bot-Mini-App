import React, { useState } from 'react';
import type { LogEntry } from '../types';

interface LogPanelProps {
  logs: LogEntry[];
  botName: string;
}

const LogPanel: React.FC<LogPanelProps> = ({ logs, botName }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleExportLogs = () => {
    if (logs.length === 0) {
      alert('No logs to export!');
      return;
    }

    // Create content for the logs using full text
    const logContent = logs.map((log, index) => {
      return `=== Log Entry ${index + 1} ===
Timestamp: ${log.timestamp}
Model: ${log.model}
Question: ${log.fullQuestion}
Answer: ${log.fullAnswer}
${'='.repeat(50)}`;
    }).join('\n\n');

    const header = `${botName} - Activity Logs
Generated on: ${new Date().toLocaleString()}
Total Logs: ${logs.length}

${'='.repeat(50)}

`;

    const fullContent = header + logContent;

    // Create and download the file
    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${botName.toLowerCase().replace(/\s+/g, '-')}-logs.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header with collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Activity Logs</h2>
            <p className="text-sm text-gray-500">
              Recent conversations ({logs.length}/5) • Hover over text to see full content
            </p>
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ml-2">
            {isCollapsed ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Export Button */}
        <button
          onClick={handleExportLogs}
          disabled={logs.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export Logs</span>
        </button>
      </div>

      {/* Log entries */}
      {!isCollapsed && (
        <div>
          {logs.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-gray-500 text-lg mb-2">No activity logs yet</p>
              <p className="text-gray-400 text-sm">Start chatting to see conversation history here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {logs.map((log, index) => (
                <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {logs.length - index}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-blue-600 text-sm">{log.timestamp}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span className="font-medium text-green-600 text-sm px-2 py-1 bg-green-50 rounded-full">{log.model}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium text-purple-600">Q:</span>
                          <span 
                            className="text-gray-700 ml-2 cursor-help hover:text-purple-700 hover:underline transition-colors" 
                            title={log.fullQuestion}
                          >
                            "{log.question}"
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-orange-600">A:</span>
                          <span 
                            className="text-gray-700 ml-2 cursor-help hover:text-orange-700 hover:underline transition-colors" 
                            title={log.fullAnswer}
                          >
                            "{log.answer}"
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LogPanel;