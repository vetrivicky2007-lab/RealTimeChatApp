package chat;

import java.net.InetSocketAddress;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UniHiveApplication {

    public static void main(String[] args) {
        String portEnv = System.getenv("PORT");
        boolean isRender = (portEnv != null && !portEnv.isBlank());
        int wsPort = isRender ? Integer.parseInt(portEnv.trim()) : 8887;

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

        SpringApplication.run(UniHiveApplication.class, args);
    }
}
