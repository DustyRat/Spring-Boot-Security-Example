package com.example;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.domain.Permission;
import com.example.domain.Role;
import com.example.domain.User;
import com.example.repository.PermissionRepository;
import com.example.repository.RoleRepository;
import com.example.repository.UserRepository;

@SpringBootApplication
@EnableJpaAuditing
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
	
	@Bean
	public CommandLineRunner authLoader(PasswordEncoder passwordEncoder, UserRepository userRepository, RoleRepository roleRepository, PermissionRepository permissionRepository) {
		return args -> {
			Set<Role> roles = new HashSet<Role>();
			Role adminRole = roleRepository.save(Role.builder().name("Admin").build().addPermission(permissionRepository.save(Permission.builder().name("ADMIN").build())));
			Role userRole = roleRepository.save(Role.builder().name("User").build().addPermission(permissionRepository.save(Permission.builder().name("USER").build())));
			roles.add(adminRole);
			roles.add(userRole);
			
			userRepository.save(User.builder().username("admin").email("admin@harrislogic.com").password(passwordEncoder.encode("password"))
					.firstName("Application").lastName("Admin").roles(roles).build());
			
			userRepository.save(User.builder().username("user").email("user@harrislogic.com").password(passwordEncoder.encode("password"))
					.firstName("Application").lastName("User").build().addRole(userRole));
		};
	}
}
