// This is the text agent that will be used to onboard the user only to contain text based agents
"use server"

import { Agent, AgentInputItem, Runner, fileSearchTool } from '@openai/agents'
import { fetchContentBySkills } from '../tools/text'
import { textSystemPrompt } from '../systemPromts'


// Create the agent instance
const textTriageAgent = new Agent({
  name: 'GoodHabitz Onboarding Assistant',
  instructions: textSystemPrompt,
  model: 'gpt-4.1',
  tools: [fetchContentBySkills, fileSearchTool(process.env.OPENAI_VECTOR_STORE_ID!)]
})



// Export the runner as a server action
  export async function runTextAgent( messages: AgentInputItem[]) {
  
  try {
    const runner = new Runner()
    const result: any = await runner.run(
      textTriageAgent,
      messages
    )


    console.log("result",result);
// console.log("history",result.history);


    return  result.output;
    

    // for await (const event of result) {
    //   // these are the raw events from the model
    //   if (event.type === 'raw_model_stream_event') {
    //     console.log(`${event.type} %o`, event.data);
    //   }
    //   // agent updated events
    //   if (event.type == 'agent_updated_stream_event') {
    //     console.log(`${event.type} %s`, event.agent.name);
    //   }
    //   // Agent SDK specific events
    //   if (event.type === 'run_item_stream_event') {
    //     console.log(`${event.type} %o`, event.item);
    //   }
    // }

    // console.log("test", result.stat.agent);
    // return {
    //   id:result.output[0].id,
    //   content:result.output[0]?.content[0]?.text,
    //   role:result.output[0]?.role
    // }

  } catch (error) {
    console.error('Agent error:', error)
    return {
      content: '',
      error: 'Failed to process message'
    }
  }
}


