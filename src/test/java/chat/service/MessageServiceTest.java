package chat.service;

import chat.dto.MessageDto;
import chat.model.Message;
import chat.repository.MessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @Mock
    private MessageRepository messageRepository;

    private MessageService messageService;

    @BeforeEach
    void setUp() {
        messageService = new MessageService(messageRepository);
    }

    @Test
    void testSaveMessageSuccess() {
        Message saved = new Message("group1", "user1", "vetrivel", "Hello guys!", "TEXT");
        saved.setId("msg1");
        saved.setTimestamp(Instant.now());

        when(messageRepository.save(any(Message.class))).thenReturn(saved);

        MessageDto dto = messageService.saveMessage("group1", "user1", "vetrivel", "Hello guys!", "TEXT");

        assertNotNull(dto);
        assertEquals("group1", dto.getGroupId());
        assertEquals("user1", dto.getSenderId());
        assertEquals("vetrivel", dto.getSenderUsername());
        assertEquals("Hello guys!", dto.getContent());
    }

    @Test
    void testSaveMessageEmptyFails() {
        assertThrows(ResponseStatusException.class,
                () -> messageService.saveMessage("group1", "user1", "vetrivel", "   ", "TEXT"));
    }

    @Test
    void testGetGroupMessages() {
        Message m1 = new Message("group1", "user1", "alice", "First", "TEXT");
        m1.setId("m1");
        Message m2 = new Message("group1", "user2", "bob", "Second", "TEXT");
        m2.setId("m2");

        // mock repository returning descending (m2, then m1)
        when(messageRepository.findByGroupIdOrderByTimestampDesc(eq("group1"), any(Pageable.class)))
                .thenReturn(new java.util.ArrayList<>(List.of(m2, m1)));

        List<MessageDto> result = messageService.getGroupMessages("group1", 50);

        assertEquals(2, result.size());
        // Should be reversed to chronological order (m1 then m2)
        assertEquals("m1", result.get(0).getId());
        assertEquals("m2", result.get(1).getId());
    }
}
