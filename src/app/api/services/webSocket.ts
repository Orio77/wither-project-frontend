import { ProgressUpdate } from "@/types/pdf.types";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;

export const connectWebSocket = (
	onProgressUpdate: (progress: ProgressUpdate) => void,
	onMessageReceived: (message: string) => void
) => {
	const socket = new SockJS(process.env.NEXT_PUBLIC_WS_URL!);
	stompClient = new Client({
		webSocketFactory: () => socket,
		debug: (str) => {
			console.log("STOMP: " + str);
		},
		reconnectDelay: 5000,
		heartbeatIncoming: 4000,
		heartbeatOutgoing: 4000,
		onWebSocketError: (event) => {
			console.error("WebSocket Error:", event);
		},
	});

	stompClient.onConnect = () => {
		console.log("Successfully connected to WebSocket");
		stompClient?.subscribe("/topic/progress", (message) => {
			console.log("Received message:", message.body);
			try {
				const progress: ProgressUpdate = JSON.parse(message.body);
				console.log("Parsed progress:", progress);
				onProgressUpdate(progress);
				onMessageReceived(message.body);
			} catch (error) {
				console.error("Error processing message:", error);
			}
		});
	};

	stompClient.onStompError = (frame) => {
		console.error("STOMP error details:", {
			headers: frame.headers,
			body: frame.body,
			command: frame.command,
		});
	};

	stompClient.activate();
	console.log("WebSocket client activated");
};

export const disconnectWebSocket = () => {
	if (stompClient) {
		stompClient.deactivate();
		stompClient = null;
	}
};
