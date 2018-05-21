package com.example.audit;

import java.util.Optional;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.domain.User;

public class AuditorAwareImpl implements AuditorAware<String> {
	@Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) { return Optional.ofNullable(null); }
        return Optional.of(authentication.getPrincipal() instanceof User ?
                ((User) authentication.getPrincipal()).getUsername() : authentication.getPrincipal().toString());
    }
}