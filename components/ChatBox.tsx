"use client"
import { useState, useRef } from "react"
import { RealtimeItem, RealtimeSession } from "@openai/agents/realtime"
import { voiceTriageAgent } from "@/agentic/agents/voice"
import { getSessionToken } from "@/agentic/server/token"
import { ChatInterface } from "./onboarding/ChatInterface"
import { VoiceInterface } from "./onboarding/VoiceInterface"
import { useChatContext } from "./contexts/ChatContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"



export const ChatBox = () => {

	const { isVoiceMode,  setVoiceMode } = useChatContext()

	const session = useRef<RealtimeSession | null>(null);

	const [history, setHistory] = useState<RealtimeItem[]>([]);
	//voice agent connect to the session token
	async function onConnect() {


		if (isVoiceMode) {
			setVoiceMode(false)

			await session.current?.close();
		} else {
			const token = await getSessionToken();
			session.current = new RealtimeSession(voiceTriageAgent, {
				model: "gpt-4o-realtime-preview-2025-06-03",
			});
			session.current.on("transport_event", (event) => {
				// console.log(event);
			});
			session.current.on("history_updated", (history) => {
				console.log(history);

				setHistory(history)

			});
			// session.current.on("function_call_result", (message: any) => {
			// 	console.log(message);
			// 	if (message.type === "function_call_result") {
			// 		console.log(message.output);
			// 	}
			// });
			// session.current.on('*', (event: any) => {
			// 	// JSON parsed version of the event received on the connection
			// 	console.log(event);
			// });
			// session.current.on(
			//   "tool_approval_requested",
			//   async (context, agent, approvalRequest) => {
			//     const response = prompt("Approve or deny the tool call?");
			//     session.current?.approve(approvalRequest.approvalItem);
			//   }
			// );
			await session.current.connect({
				apiKey: token,
			});
			setVoiceMode(true)
		}
	}

	const toggleVoiceMode = () => {
		onConnect()
	}


	return (
		<div className=" w-full pt-6 h-full ">
			<Tabs defaultValue="chat" className="flex  items-center h-full flex-col w-full">
				<TabsList className="flex  ">
					<TabsTrigger value="chat" onClick={isVoiceMode ? toggleVoiceMode : undefined}>Chat</TabsTrigger>
					<TabsTrigger value="voice" onClick={isVoiceMode ? undefined : toggleVoiceMode}>Voice</TabsTrigger>
				</TabsList>
				<TabsContent value="chat" className="h-full">
					<ChatInterface />
				</TabsContent>
				<TabsContent value="voice" className="h-full">
					<VoiceInterface onClose={() => toggleVoiceMode()} isVoiceMode={isVoiceMode} history={history} />
				</TabsContent>
			</Tabs>
		</div>
	)
}


