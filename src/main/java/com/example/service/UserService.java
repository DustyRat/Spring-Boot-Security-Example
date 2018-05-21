package com.example.service;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.domain.Role;
import com.example.domain.User;
import com.example.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	
	private final UserRepository repository;

	public Optional<User> get(UUID id) {
		return repository.findById(id);
	}
	
	public Iterable<User> findAll() {
		return repository.findAll();
	}
	
	public Iterable<User> findAllByRole(Role role) {
		return repository.findAllByRoles(role);
	}
	
	public Iterable<User> findAllByRole(Collection<Role> roles) {
		return repository.findAllByRoles(roles);
	}
	
	public Boolean exists(UUID id) {
		return repository.existsById(id);
	}
	
}
