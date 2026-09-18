package chat.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class WsAction {

    private String type; // AUTH, JOIN_GROUP, LEAVE_GROUP, SEND_MESSAGE, NEW_MESSAGE, ONLINE_USERS, ERROR, AUTH_SUCCESS
    private String token;
    private String groupId;
    private String content;
    private MessageDto message;
    private Integer onlineCount;
    private List<String> users;
    private String error;

    public WsAction() {
    }

    public static WsAction error(String error) {
        WsAction action = new WsAction();
        action.setType("ERROR");
        action.setError(error);
        return action;
    }

    public static WsAction authSuccess(String username) {
        WsAction action = new WsAction();
        action.setType("AUTH_SUCCESS");
        action.setContent(username);
        return action;
    }

    public static WsAction newMessage(MessageDto messageDto) {
        WsAction action = new WsAction();
        action.setType("NEW_MESSAGE");
        action.setGroupId(messageDto.getGroupId());
        action.setMessage(messageDto);
        return action;
    }

    public static WsAction onlineUsers(String groupId, int count, List<String> users) {
        WsAction action = new WsAction();
        action.setType("ONLINE_USERS");
        action.setGroupId(groupId);
        action.setOnlineCount(count);
        action.setUsers(users);
        return action;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public MessageDto getMessage() {
        return message;
    }

    public void setMessage(MessageDto message) {
        this.message = message;
    }

    public Integer getOnlineCount() {
        return onlineCount;
    }

    public void setOnlineCount(Integer onlineCount) {
        this.onlineCount = onlineCount;
    }

    public List<String> getUsers() {
        return users;
    }

    public void setUsers(List<String> users) {
        this.users = users;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
