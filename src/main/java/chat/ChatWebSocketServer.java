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

    @Override
    public void onOpen(
            WebSocket conn,
            ClientHandshake handshake) {

        System.out.println(
                "Client connected: "
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
                "Client disconnected");
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
                "WebSocket Server started on port 8080");
    }

  public static void main(String[] args) {

    int port = Integer.parseInt(
        System.getenv().getOrDefault("PORT", "8080")
    );

    ChatWebSocketServer server =
        new ChatWebSocketServer(port);

    server.start();
}
}