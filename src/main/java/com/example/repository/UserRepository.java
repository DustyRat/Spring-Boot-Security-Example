package com.example.repository;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import com.example.domain.Role;
import com.example.domain.User;

public interface UserRepository extends CrudRepository<User, UUID>, JpaRepository<User, UUID> {

	Optional<User> findByUsername(String username);
	
//	Optional<User> findByEmail(String email);
	
	@Override
    void delete(User user);

	Iterable<User> findAllByRoles(Role role);
	
	Iterable<User> findAllByRoles(Collection<Role> roles);
}
