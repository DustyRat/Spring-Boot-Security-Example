package com.example.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import com.example.domain.Permission;

public interface PermissionRepository extends CrudRepository<Permission, UUID>, JpaRepository<Permission, UUID> {
	Permission findByName(String name);

    @Override
    void delete(Permission permission);
}
