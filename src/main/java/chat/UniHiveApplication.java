package chat;

import java.net.InetSocketAddress;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UniHiveApplication {

    public static void main(String[] args) {
        String portEnv = System.getenv("PORT");
        boolean isRender = (portEnv != null && !portEnv.isBlank());
        int appPort = isRender ? Integer.parseInt(portEnv.trim()) : 8080;

        System.out.println("========================================");
        System.out.println("UNIHIVE / REALTIME CHAT WEBSOCKET");
        System.out.println("========================================");
        System.out.println("Environment: " + (isRender ? "RENDER" : "LOCAL"));
        System.out.println("Host: 0.0.0.0");
        System.out.println("Port: " + appPort);
        System.out.println("WebSocket: READY");
        System.out.println("========================================");

        // Start standalone ChatWebSocketServer on 8887 for standalone client compatibility
        try {
            int wsPort = 8887;
            InetSocketAddress address = new InetSocketAddress("0.0.0.0", wsPort);
            ChatWebSocketServer server = new ChatWebSocketServer(address);
            server.start();
            System.out.println("UniHive standalone WebSocket server started on 0.0.0.0:" + wsPort);
        } catch (Exception e) {
            System.out.println("Standalone WebSocket notice: " + e.getMessage());
        }

        SpringApplication.run(UniHiveApplication.class, args);
    }
}
