package com.example.Backend.dto;

import com.example.Backend.model.Role;
import com.example.Backend.model.User;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private String address;
    private String phone;

    public UserResponse() {
    }

    public static UserResponse fromUser(User user) {
        UserResponse dto = new UserResponse();
        dto.id = user.getId();
        dto.name = user.getName();
        dto.email = user.getEmail();
        dto.role = user.getRole();
        dto.address = user.getAddress();
        dto.phone = user.getPhone();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
