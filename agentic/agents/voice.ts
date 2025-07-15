
import { RealtimeAgent } from '@openai/agents/realtime'
import { voiceSystemPrompt } from '../systemPromts';
import { fetchContentBySkills } from '../tools/voice';


export const voiceTriageAgent = new RealtimeAgent({
  name: "Voice Agent",
  instructions: voiceSystemPrompt,
  tools: [fetchContentBySkills],
  // handoffs: [weatherAgent],
});
