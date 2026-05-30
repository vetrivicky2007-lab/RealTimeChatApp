const socket = new WebSocket("wss://realtimechatapp-1-e4j1.onrender.com");

const sendButton =
    document.getElementById("sendBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const input =
    document.querySelector("input");

const messages =
    document.querySelector(".messages");

const userList =
    document.getElementById("user-list");

const username =
    localStorage.getItem("username") || "You";

socket.onopen = () => {

    socket.send(
        "JOIN:" + username
    );
};

socket.onmessage = (event) => {

    const data = event.data;

    if(data.startsWith("USERS:")){

        const users =
            data.substring(6).split(",");

        userList.innerHTML = "";

        users.forEach(user => {

            userList.innerHTML += `
                <div class="user">
                    🟢 ${user}
                </div>
            `;
        });

        return;
    }

    if(data.startsWith("MSG:")){

        const msg =
            data.substring(4);

        const sender =
            msg.split(":")[0].trim();

        const text =
            msg.substring(
                msg.indexOf(":") + 1
            );

        const now =
            new Date();

        const time =
            now.getHours() + ":" +
            String(
                now.getMinutes()
            ).padStart(2,"0");

        const mine =
            sender === username;

        messages.innerHTML += `

        <div class="${
            mine
            ? "my-message"
            : "other-message"
        }">

            <div class="message-header">
                ${sender}
                •
                ${time}
            </div>

            <div class="${
                mine
                ? "message-bubble"
                : "other-bubble"
            }">

                ${text}

            </div>

        </div>

        `;

        messages.scrollTop =
            messages.scrollHeight;
    }
};

function sendMessage(){

    const text =
        input.value.trim();

    if(text === ""){
        return;
    }

    socket.send(
        username + ": " + text
    );

    input.value = "";
}

sendButton.addEventListener(
    "click",
    sendMessage
);

input.addEventListener(
    "keydown",
    e => {

        if(e.key === "Enter"){

            sendMessage();
        }
    }
);

logoutBtn.addEventListener(
    "click",
    () => {

        localStorage.clear();

        location.href =
            "login.html";
    }
);