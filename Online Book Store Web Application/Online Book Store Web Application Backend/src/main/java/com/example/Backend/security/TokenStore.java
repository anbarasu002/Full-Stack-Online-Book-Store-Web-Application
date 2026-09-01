package com.example.Backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenStore {

    private static class TokenData {
        final Long userId;
        Instant expiresAt;

        TokenData(Long userId, Instant expiresAt) {
            this.userId = userId;
            this.expiresAt = expiresAt;
        }
    }

    private final Map<String, TokenData> tokens = new ConcurrentHashMap<>();

    @Value("${app.auth.token-expiry-minutes:180}")
    private long expiryMinutes;

    public String issueToken(Long userId) {
        String token = UUID.randomUUID().toString();
        tokens.put(token, new TokenData(userId, Instant.now().plusSeconds(expiryMinutes * 60)));
        return token;
    }

    public Long resolveUserId(String token) {
        if (token == null) return null;
        TokenData data = tokens.get(token);
        if (data == null) return null;
        if (Instant.now().isAfter(data.expiresAt)) {
            tokens.remove(token);
            return null;
        }

        data.expiresAt = Instant.now().plusSeconds(expiryMinutes * 60);
        return data.userId;
    }

    public void revoke(String token) {
        if (token != null) {
            tokens.remove(token);
        }
    }
}
