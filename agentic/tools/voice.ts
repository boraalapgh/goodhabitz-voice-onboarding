import { tool } from "@openai/agents/realtime";
import { z } from "zod";
import { fetchContentBySkillsCore } from "./filterCourses";

export const fetchContentBySkills = tool({
  name: 'fetchContentBySkills',
  description: 'Fetch course suggestions based on skills extracted from user messages. Uses three-tier search: exact match, alias mapping, and semantic search.',
  parameters: z.object({
    skills: z.array(z.string()).min(1).describe('Raw skill phrases extracted from user messages'),
    includeDetails: z.boolean().optional().default(false).describe('Whether to include full content details in response')
  }),
  async execute({ skills, includeDetails }) {
    const result = await fetchContentBySkillsCore(skills, includeDetails)
    console.log("tool result",result);
    return result
  }
})