package chat;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;

public class ChatServer {

    public static ArrayList<ClientHandler> clients =
            new ArrayList<>();

    public static void main(String[] args) {

        try {

            ServerSocket server =
                    new ServerSocket(6000);

            System.out.println(
                    "Chat Server Started on Port 6000"
            );

            while (true) {

                Socket client =
                        server.accept();

                System.out.println(
                        "New Client Connected: "
                        + client.getInetAddress()
                );

                ClientHandler handler =
                        new ClientHandler(client);

                clients.add(handler);

                handler.start();

            }

        } catch (IOException e) {

            e.printStackTrace();

        }

    }

}