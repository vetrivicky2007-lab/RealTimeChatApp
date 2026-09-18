package chat;

import java.io.IOException;
import java.net.Socket;

public class ChatClient {

    public static void main(String[] args) {

        try {

            Socket socket =
                    new Socket("localhost", 6000);

            System.out.println(
                    "Connected to Server!"
            );

        } catch (IOException e) {

            e.printStackTrace();

        }

    }

}
