package com.example.service;

import java.util.Collection;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.domain.Permission;
import com.example.domain.User;
import com.example.repository.UserRepository;

import lombok.Data;

@Data
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	private final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(_user -> {
//        	Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
//    		Set<Permission> permissions = new HashSet<Permission>();
//    		_user.getRoles().stream().forEach(role -> { permissions.addAll(role.getPermissions()); });
//    		permissions.forEach(permission -> { authorities.add(new SimpleGrantedAuthority(permission.getName())); });
//    		return new org.springframework.security.core.userdetails.User(_user.getUsername(), _user.getPassword(), authorities);
        	return _user;
        }).orElseThrow(() -> new UsernameNotFoundException("User " + username + " was not found in the Db"));
    }
}
