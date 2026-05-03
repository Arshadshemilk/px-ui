import packageJson from '../../package.json';

export const handleChat = async (prompt: string): Promise<string> => {
  if (prompt.trim().toLowerCase() === 'help') {
    return "This is an AI Chat terminal. Just type anything to chat with EA-llama.cpp.";
  }

  if (prompt.trim().toLowerCase() === 'clear') {
    return "CLEAR_COMMAND"; // Special signal to clear
  }

  // Mock AI response logic
  return `[Llama-3] ${prompt.length > 20 ? 'Analyzing your request...' : 'Processing...'}
  
Based on my knowledge base, here is a response to: "${prompt}"

This is a simulated AI response from the EA-llama.cpp engine. In a production environment, this would call a local or remote LLM API. The terminal is now purely chat-focused.`;
};