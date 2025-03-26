import { ProgressUpdate } from "@/types/pdf.types";
import { ScrapeItemReviewRequest } from "@/types/wither.types";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;
const subscribers: Map<string, Set<(data: any) => void>> = new Map();

export const connectWebSocket = () => {
	if (stompClient) return;

	const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "/api/ws";
	const socket = new SockJS(wsUrl);

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

		// Set up subscriptions for all registered topics
		subscribers.forEach((callbacks, topic) => {
			subscribeToTopic(topic);
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

// Subscribe to a specific topic
const subscribeToTopic = (topic: string) => {
	if (!stompClient || !stompClient.connected) return;

	stompClient.subscribe(topic, (message) => {
		try {
			const data = JSON.parse(message.body);
			const callbacks = subscribers.get(topic);
			if (callbacks) {
				callbacks.forEach((callback) => callback(data));
			}
		} catch (error) {
			console.error(`Error processing message from ${topic}:`, error);
		}
	});
};

// Add a listener for a specific topic
export const addTopicListener = <T>(
	topic: string,
	callback: (data: T) => void
): (() => void) => {
	if (!subscribers.has(topic)) {
		subscribers.set(topic, new Set());

		// If client is already connected, subscribe immediately
		if (stompClient?.connected) {
			subscribeToTopic(topic);
		}
	}

	subscribers.get(topic)!.add(callback);

	// Ensure connection is active
	connectWebSocket();

	// Return unsubscribe function
	return () => {
		const callbacks = subscribers.get(topic);
		if (callbacks) {
			callbacks.delete(callback);
			if (callbacks.size === 0) {
				subscribers.delete(topic);
			}
		}
	};
};

// Helper functions for specific topics
export const subscribeToProgressUpdates = (
	callback: (data: ProgressUpdate) => void
): (() => void) => {
	return addTopicListener<ProgressUpdate>("/topic/progress/summary", callback);
};

export const subscribeToScrapeItemReviews = (
	callback: (data: ScrapeItemReviewRequest) => void
): (() => void) => {
	return addTopicListener<ScrapeItemReviewRequest>(
		"/topic/review/scrape-items",
		callback
	);
};
