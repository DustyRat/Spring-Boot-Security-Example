package com.example.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.domain.Role;
import com.example.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleService {
	private final RoleRepository repository;
	
	public Optional<Role> get(UUID id) {
		return repository.findById(id);
	}
	
	public Iterable<Role> findAll() {
		return repository.findAll();
	}
	
	public Boolean exists(UUID id) {
		return repository.existsById(id);
	}
}
