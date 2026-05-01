package com.testmind;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import com.testmind.entity.User;
import com.testmind.repository.UserRepository;
import com.testmind.service.UserService;
import com.testmind.dto.UserDTO;
import com.testmind.dto.CreateUserRequest;
import com.testmind.dto.UpdateUserRequest;
import com.testmind.exception.UserNotFoundException;
import com.testmind.exception.EmailAlreadyExistsException;
import com.testmind.exception.UsernameAlreadyExistsException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@SpringBootTest
@DisplayName("User Service Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private CreateUserRequest createRequest;
    private UpdateUserRequest updateRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@testmind.com");
        testUser.setPassword("password123");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setActive(true);
        
        createRequest = new CreateUserRequest();
        createRequest.setUsername("newuser");
        createRequest.setEmail("new@testmind.com");
        createRequest.setPassword("password123");
        createRequest.setFirstName("New");
        createRequest.setLastName("User");
        
        updateRequest = new UpdateUserRequest();
        updateRequest.setUsername("updateduser");
        updateRequest.setEmail("updated@testmind.com");
        updateRequest.setActive(false);
    }

    @Nested
    @DisplayName("Find User Tests")
    class FindUserTests {

        @Test
        @DisplayName("Should find user by ID successfully")
        void shouldFindUserById() {
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            
            UserDTO result = userService.findUserById(1L);
            
            assertNotNull(result);
            assertEquals("testuser", result.getUsername());
            assertEquals("test@testmind.com", result.getEmail());
        }

        @Test
        @DisplayName("Should throw exception when user not found by ID")
        void shouldThrowExceptionWhenUserNotFoundById() {
            when(userRepository.findById(99L)).thenReturn(Optional.empty());
            
            assertThrows(UserNotFoundException.class, () -> {
                userService.findUserById(99L);
            });
        }

        @Test
        @DisplayName("Should find user by email successfully")
        void shouldFindUserByEmail() {
            when(userRepository.findByEmail("test@testmind.com")).thenReturn(Optional.of(testUser));
            
            UserDTO result = userService.findUserByEmail("test@testmind.com");
            
            assertNotNull(result);
            assertEquals("testuser", result.getUsername());
        }

        @Test
        @DisplayName("Should find user by username successfully")
        void shouldFindUserByUsername() {
            when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
            
            UserDTO result = userService.findUserByUsername("testuser");
            
            assertNotNull(result);
            assertEquals("test@testmind.com", result.getEmail());
        }

        @Test
        @DisplayName("Should find all users successfully")
        void shouldFindAllUsers() {
            when(userRepository.findAll()).thenReturn(Arrays.asList(testUser));
            
            List<UserDTO> result = userService.findAllUsers();
            
            assertNotNull(result);
            assertEquals(1, result.size());
        }

        @Test
        @DisplayName("Should find active users successfully")
        void shouldFindActiveUsers() {
            when(userRepository.findByActiveTrue()).thenReturn(Arrays.asList(testUser));
            
            List<UserDTO> result = userService.findActiveUsers();
            
            assertNotNull(result);
            assertEquals(1, result.size());
            assertTrue(result.get(0).getActive());
        }
    }

    @Nested
    @DisplayName("Create User Tests")
    class CreateUserTests {

        @Test
        @DisplayName("Should create user successfully")
        void shouldCreateUser() {
            when(userRepository.existsByEmail("new@testmind.com")).thenReturn(false);
            when(userRepository.existsByUsername("newuser")).thenReturn(false);
            when(userRepository.save(any(User.class))).thenReturn(testUser);
            
            UserDTO result = userService.createUser(createRequest);
            
            assertNotNull(result);
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw exception when email already exists")
        void shouldThrowExceptionWhenEmailExists() {
            when(userRepository.existsByEmail("new@testmind.com")).thenReturn(true);
            
            assertThrows(EmailAlreadyExistsException.class, () -> {
                userService.createUser(createRequest);
            });
        }

        @Test
        @DisplayName("Should throw exception when username already exists")
        void shouldThrowExceptionWhenUsernameExists() {
            when(userRepository.existsByEmail("new@testmind.com")).thenReturn(false);
            when(userRepository.existsByUsername("newuser")).thenReturn(true);
            
            assertThrows(UsernameAlreadyExistsException.class, () -> {
                userService.createUser(createRequest);
            });
        }
    }

    @Nested
    @DisplayName("Update User Tests")
    class UpdateUserTests {

        @Test
        @DisplayName("Should update user successfully")
        void shouldUpdateUser() {
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(userRepository.existsByUsername(anyString())).thenReturn(false);
            when(userRepository.save(any(User.class))).thenReturn(testUser);
            
            UserDTO result = userService.updateUser(1L, updateRequest);
            
            assertNotNull(result);
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw exception when updating non-existent user")
        void shouldThrowExceptionWhenUpdatingNonExistentUser() {
            when(userRepository.findById(99L)).thenReturn(Optional.empty());
            
            assertThrows(UserNotFoundException.class, () -> {
                userService.updateUser(99L, updateRequest);
            });
        }

        @Test
        @DisplayName("Should throw exception when email conflicts on update")
        void shouldThrowExceptionWhenEmailConflicts() {
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(userRepository.existsByEmail("updated@testmind.com")).thenReturn(true);
            
            assertThrows(EmailAlreadyExistsException.class, () -> {
                userService.updateUser(1L, updateRequest);
            });
        }
    }

    @Nested
    @DisplayName("Delete User Tests")
    class DeleteUserTests {

        @Test
        @DisplayName("Should delete user successfully")
        void shouldDeleteUser() {
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            doNothing().when(userRepository).delete(testUser);
            
            userService.deleteUser(1L);
            
            verify(userRepository, times(1)).delete(testUser);
        }

        @Test
        @DisplayName("Should throw exception when deleting non-existent user")
        void shouldThrowExceptionWhenDeletingNonExistentUser() {
            when(userRepository.findById(99L)).thenReturn(Optional.empty());
            
            assertThrows(UserNotFoundException.class, () -> {
                userService.deleteUser(99L);
            });
        }
    }

    @Nested
    @DisplayName("Activate/Deactivate Tests")
    class ActivateDeactivateTests {

        @Test
        @DisplayName("Should activate user successfully")
        void shouldActivateUser() {
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);
            
            UserDTO result = userService.activateUser(1L);
            
            assertTrue(result.getActive());
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should deactivate user successfully")
        void shouldDeactivateUser() {
            testUser.setActive(true);
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);
            
            UserDTO result = userService.deactivateUser(1L);
            
            assertFalse(result.getActive());
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw exception when activating non-existent user")
        void shouldThrowExceptionWhenActivatingNonExistentUser() {
            when(userRepository.findById(99L)).thenReturn(Optional.empty());
            
            assertThrows(UserNotFoundException.class, () -> {
                userService.activateUser(99L);
            });
        }
    }

    @Nested
    @DisplayName("Search Tests")
    class SearchTests {

        @Test
        @DisplayName("Should search users by keyword successfully")
        void shouldSearchUsers() {
            when(userRepository.searchUsers("test")).thenReturn(Arrays.asList(testUser));
            
            List<UserDTO> result = userService.searchUsers("test");
            
            assertNotNull(result);
            assertEquals(1, result.size());
        }

        @Test
        @DisplayName("Should get active user count")
        void shouldGetActiveUserCount() {
            when(userRepository.countActiveUsers()).thenReturn(5L);
            
            Long count = userService.getActiveUserCount();
            
            assertEquals(5L, count);
        }

        @Test
        @DisplayName("Should get recent users")
        void shouldGetRecentUsers() {
            when(userRepository.findRecentUsers(any())).thenReturn(Arrays.asList(testUser));
            
            List<UserDTO> result = userService.findRecentUsers();
            
            assertNotNull(result);
            assertEquals(1, result.size());
        }
    }

    @Nested
    @DisplayName("User Conversion Tests")
    class ConversionTests {

        @Test
        @DisplayName("Should convert user entity to DTO correctly")
        void shouldConvertEntityToDTO() {
            UserDTO dto = userService.findUserById(1L);
            
            assertNotNull(dto);
            assertEquals(testUser.getId(), dto.getId());
            assertEquals(testUser.getUsername(), dto.getUsername());
            assertEquals(testUser.getEmail(), dto.getEmail());
            assertEquals(testUser.getFirstName(), dto.getFirstName());
            assertEquals(testUser.getLastName(), dto.getLastName());
            assertEquals(testUser.getActive(), dto.getActive());
        }
    }
}
