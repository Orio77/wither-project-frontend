import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export interface ProgressUpdate {
	fileName: string;
	stage: string;
	currentPage: number;
	totalPages: number;
	currentChapter: number;
	totalChapters: number;
	percentComplete: number;
}

const WS_BASE_URL =
	process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws";
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000;

export const useWebSocket = (
	onProgress: (update: ProgressUpdate) => void,
	onError?: (error: Error) => void
) => {
	useEffect(() => {
		let reconnectAttempt = 0;
		let isConnecting = false;
		let client: Client | null = null;

		const connect = () => {
			if (isConnecting) {
				console.log("[WebSocket] Already attempting to connect, skipping...");
				return;
			}
			console.log("[WebSocket] Initiating connection to", WS_BASE_URL);
			isConnecting = true;

			client = new Client({
				webSocketFactory: () => {
					console.log("[WebSocket] Creating new SockJS instance");
					return new SockJS(WS_BASE_URL);
				},
				connectHeaders: {},
				debug: (str) => {
					console.debug("[WebSocket Debug]:", str);
				},
				reconnectDelay: RECONNECT_DELAY,
				heartbeatIncoming: 4000,
				heartbeatOutgoing: 4000,

				onConnect: () => {
					console.log("[WebSocket] Successfully connected");
					isConnecting = false;
					reconnectAttempt = 0;

					client?.subscribe(
						"/topic/progress",
						(message) => {
							console.log("[WebSocket] Received message:", message);
							try {
								const progress: ProgressUpdate = JSON.parse(message.body);
								onProgress(progress);
							} catch (error) {
								console.error("[WebSocket] Message parsing error:", error);
								onError?.(
									new Error(`Failed to parse progress update: ${error}`)
								);
							}
						},
						{
							id: "progress-subscription",
						}
					);
				},

				onDisconnect: () => {
					console.log("[WebSocket] Disconnected, isConnecting =", isConnecting);
					isConnecting = false;
				},

				onStompError: (frame) => {
					console.error("[WebSocket] STOMP error:", frame);
					console.error("[WebSocket] Headers:", frame.headers);
					console.error("[WebSocket] Command:", frame.command);
					onError?.(new Error(`WebSocket STOMP error: ${frame.body}`));
					isConnecting = false;
				},

				onWebSocketError: (event) => {
					console.error("[WebSocket] Error event:", event);
					console.error("[WebSocket] Error type:", event.type);
					console.error("[WebSocket] Error details:", {
						bubbles: event.bubbles,
						cancelable: event.cancelable,
						composed: event.composed,
						eventPhase: event.eventPhase,
						target: event.target,
					});
					isConnecting = false;

					if (reconnectAttempt < MAX_RECONNECT_ATTEMPTS) {
						reconnectAttempt++;
						console.log(
							`[WebSocket] Scheduling reconnection attempt ${reconnectAttempt}/${MAX_RECONNECT_ATTEMPTS} in ${
								RECONNECT_DELAY * reconnectAttempt
							}ms`
						);
						setTimeout(connect, RECONNECT_DELAY * reconnectAttempt);
					} else {
						console.error("[WebSocket] Max reconnection attempts reached");
						onError?.(
							new Error(
								"Failed to connect to WebSocket server after multiple attempts"
							)
						);
					}
				},
			});

			try {
				console.log("[WebSocket] Activating client");
				client.activate();
			} catch (error) {
				console.error("[WebSocket] Activation error:", error);
				isConnecting = false;
				onError?.(new Error(`Failed to initialize WebSocket: ${error}`));
			}
		};

		connect();

		return () => {
			console.log("[WebSocket] Cleanup - deactivating client");
			if (client?.active) {
				client.deactivate();
			}
			isConnecting = false;
		};
	}, []);
};
