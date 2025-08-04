import React, { useState } from 'react';
import type { BotConfig } from '../types';

interface BotConfigFormProps {
  config: BotConfig;
  onConfigUpdate: (config: BotConfig) => void;
  onSaveConfiguration: () => void;
  onSessionReset: () => void;
  hasUnsavedChanges: boolean;
}

const BotConfigForm: React.FC<BotConfigFormProps> = ({ 
  config, 
  onConfigUpdate, 
  onSaveConfiguration, 
  onSessionReset, 
  hasUnsavedChanges 
}) => {
  const [localConfig, setLocalConfig] = useState<BotConfig>(config);

  // Update local config when props change (e.g., after reset)
  React.useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleInputChange = (field: keyof BotConfig, value: string) => {
    const updatedConfig = {
      ...localConfig,
      [field]: value
    };
    setLocalConfig(updatedConfig);
    // Update draft configuration only
    onConfigUpdate(updatedConfig);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the entire session? This will clear all configuration, chat history, and logs.')) {
      onSessionReset();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Bot Configuration</h2>
      
      {/* Bot Name Input */}
      <div>
        <label htmlFor="botName" className="block text-sm font-medium text-gray-700 mb-1">
          Bot Name
        </label>
        <input
          id="botName"
          type="text"
          value={localConfig.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter bot name..."
        />
      </div>

      {/* Persona Input */}
      <div>
        <label htmlFor="persona" className="block text-sm font-medium text-gray-700 mb-1">
          Persona
        </label>
        <textarea
          id="persona"
          value={localConfig.persona}
          onChange={(e) => handleInputChange('persona', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Describe the bot's personality and behavior..."
        />
      </div>

      {/* Model Selection */}
      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
          Model Selection
        </label>
        <select
          id="model"
          value={localConfig.model}
          onChange={(e) => handleInputChange('model', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-4o">GPT-4o</option>
          <option value="mistral-7b">Mistral 7B (OpenRouter)</option>
        </select>
      </div>

      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-2">⚠️</div>
            <div className="text-sm text-yellow-800">
              <strong>Unsaved Changes:</strong> Your configuration changes haven't been saved yet. 
              Press "Save Configuration" to apply them.
            </div>
          </div>
        </div>
      )}

      {/* Save Configuration Button */}
      <button
        onClick={onSaveConfiguration}
        disabled={!hasUnsavedChanges}
        className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors mb-3 ${
          hasUnsavedChanges
            ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {hasUnsavedChanges ? 'Save Configuration' : 'Configuration Saved'}
      </button>

      {/* Session Reset Button */}
      <button
        onClick={handleReset}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
      >
        Reset Session
      </button>
    </div>
  );
};

export default BotConfigForm;