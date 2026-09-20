package chat;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Scanner;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

public class ChatClient extends WebSocketClient {

    public static final String LOCAL_WS_URL = "ws://localhost:8887";
    public static final String RENDER_WS_URL = "wss://realtimechatapp-2-wmp5.onrender.com";

    public ChatClient(URI serverUri) {
        super(serverUri);
    }

    @Override
    public void onOpen(ServerHandshake handshakedata) {
        System.out.println("Connected to WebSocket server: " + getURI());
    }

    @Override
    public void onMessage(String message) {
        System.out.println("Received: " + message);
    }

    @Override
    public void onClose(int code, String reason, boolean remote) {
        System.out.println("Disconnected from WebSocket server. Code: " + code + ", Reason: " + reason);
    }

    @Override
    public void onError(Exception ex) {
        System.err.println("WebSocket error: " + (ex != null ? ex.getMessage() : "unknown"));
    }

    public static String resolveServerUrl(String[] args) {
        if (args != null && args.length > 0 && args[0] != null && !args[0].isBlank()) {
            String arg = args[0].trim();
            if ("render".equalsIgnoreCase(arg)) {
                return RENDER_WS_URL;
            }
            if ("local".equalsIgnoreCase(arg)) {
                return LOCAL_WS_URL;
            }
            if (arg.startsWith("ws://") || arg.startsWith("wss://")) {
                return arg;
            }
        }

        String envUrl = System.getenv("WS_URL");
        if (envUrl != null && !envUrl.isBlank()) {
            return envUrl.trim();
        }

        if (System.getenv("RENDER") != null) {
            return RENDER_WS_URL;
        }

        return LOCAL_WS_URL;
    }

    public static void main(String[] args) {
        String serverUrl = resolveServerUrl(args);
        System.out.println("Target WebSocket URL: " + serverUrl);

        try {
            URI uri = new URI(serverUrl);
            ChatClient client = new ChatClient(uri);

            System.out.println("Connecting to " + uri + "...");
            boolean connected = client.connectBlocking();

            if (!connected) {
                System.err.println("Failed to connect to " + uri);
                return;
            }

            System.out.println("Connected successfully!");

            String username = (args != null && args.length > 1 && !args[1].isBlank())
                    ? args[1]
                    : "JavaClient_" + (System.currentTimeMillis() % 1000);

            // Join server
            client.send("JOIN:" + username);

            // If an explicit test message is passed in CLI arguments, send it and wait
            if (args != null && args.length > 2 && !args[2].isBlank()) {
                String testMsg = args[2];
                System.out.println("Sending message: " + testMsg);
                client.send(testMsg);
                Thread.sleep(1500);
                client.closeBlocking();
                return;
            }

            // Interactive message sending mode
            System.out.println("Type messages and press Enter to send (type '/quit' to exit):");
            Scanner scanner = new Scanner(System.in);
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                if ("/quit".equalsIgnoreCase(line.trim())) {
                    break;
                }
                if (!line.trim().isEmpty()) {
                    client.send(line);
                }
            }
            client.closeBlocking();
        } catch (URISyntaxException e) {
            System.err.println("Invalid WebSocket URI: " + serverUrl + " - " + e.getMessage());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Connection interrupted: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error running ChatClient: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
