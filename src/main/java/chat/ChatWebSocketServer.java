package chat;

import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class ChatWebSocketServer extends WebSocketServer {

    private static Map<WebSocket, String> users =
            new HashMap<>();

    public ChatWebSocketServer(int port) {
        super(new InetSocketAddress(port));
    }

    public ChatWebSocketServer(InetSocketAddress address) {
        super(address);
    }

    @Override
    public void onOpen(
            WebSocket conn,
            ClientHandshake handshake) {

        System.out.println(
                "WebSocket client connected: "
                + conn.getRemoteSocketAddress());
    }

    @Override
    public void onClose(
            WebSocket conn,
            int code,
            String reason,
            boolean remote) {

        users.remove(conn);

        broadcastUsers();

        System.out.println(
                "WebSocket client disconnected: "
                + (conn != null ? conn.getRemoteSocketAddress() : "unknown"));
    }

    @Override
    public void onMessage(
            WebSocket conn,
            String message) {

        if(message.startsWith("JOIN:")){

            String username =
                    message.substring(5);

            users.put(conn, username);

            broadcastUsers();

            return;
        }

        for(WebSocket client : users.keySet()){

            client.send(
                    "MSG:" + message
            );
        }
    }

    private void broadcastUsers(){

        StringBuilder list =
                new StringBuilder();

        for(String user : users.values()){

            if(list.length() > 0){
                list.append(",");
            }

            list.append(user);
        }

        for(WebSocket client : users.keySet()){

            client.send(
                    "USERS:" + list
            );
        }
    }

    @Override
    public void onError(
            WebSocket conn,
            Exception ex) {

        ex.printStackTrace();
    }

    @Override
    public void onStart() {
        System.out.println(
                "WebSocket Server started on " + getAddress());
    }

    public static void main(String[] args) {
        String portEnv = System.getenv("PORT");
        boolean isRender = (portEnv != null && !portEnv.isBlank());
        int wsPort = isRender
                ? Integer.parseInt(portEnv.trim())
                : 8887;

        InetSocketAddress address = new InetSocketAddress("0.0.0.0", wsPort);
        ChatWebSocketServer server = new ChatWebSocketServer(address);
        server.start();

        System.out.println("========================================");
        System.out.println("UNIHIVE / REALTIME CHAT WEBSOCKET");
        System.out.println("========================================");
        System.out.println("Environment: " + (isRender ? "RENDER" : "LOCAL"));
        System.out.println("Host: 0.0.0.0");
        System.out.println("Port: " + wsPort);
        System.out.println("WebSocket: READY");
        System.out.println("========================================");
        System.out.println("UniHive WebSocket server started on 0.0.0.0:" + wsPort);
    }
}