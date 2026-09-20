package chat;

import java.net.InetSocketAddress;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = {UserDetailsServiceAutoConfiguration.class})
public class UniHiveApplication {

    public static void main(String[] args) {
        String portEnv = System.getenv("PORT");
        boolean isRender = (portEnv != null && !portEnv.isBlank());
        int wsPort = isRender ? Integer.parseInt(portEnv.trim()) : 8887;

        InetSocketAddress address = new InetSocketAddress("0.0.0.0", wsPort);
        ChatWebSocketServer server = new ChatWebSocketServer(address);
        server.start();

        System.out.println("========================================");
        System.out.println("UNIHIVE WEBSOCKET SERVER");
        System.out.println("========================================");
        System.out.println("Environment: " + (isRender ? "RENDER" : "LOCAL"));
        System.out.println("Host: 0.0.0.0");
        System.out.println("PORT: " + wsPort);
        System.out.println("WebSocket server: STARTED");
        System.out.println("========================================");

        SpringApplication.run(UniHiveApplication.class, args);
    }
}
