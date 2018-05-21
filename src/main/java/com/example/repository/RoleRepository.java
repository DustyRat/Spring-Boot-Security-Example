package com.example.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import com.example.domain.Role;

public interface RoleRepository extends CrudRepository<Role, UUID>, JpaRepository<Role, UUID> {
	Optional<Role> findById(UUID id);
	
	Role findByName(String name);
	
//	Boolean exists(UUID id);

    @Override
    void delete(Role role);
}
