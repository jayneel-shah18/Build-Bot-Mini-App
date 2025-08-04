import React, { useState } from 'react';
import type { BotConfig } from '../types';

interface BotConfigFormProps {
  config: BotConfig;
  onConfigUpdate: (config: BotConfig) => void;
  onSessionReset: () => void;
}

const BotConfigForm: React.FC<BotConfigFormProps> = ({ config, onConfigUpdate, onSessionReset }) => {
  const [localConfig, setLocalConfig] = useState<BotConfig>(config);

  const handleInputChange = (field: keyof BotConfig, value: string) => {
    setLocalConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onConfigUpdate(localConfig);
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

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mb-3"
      >
        Save Configuration
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