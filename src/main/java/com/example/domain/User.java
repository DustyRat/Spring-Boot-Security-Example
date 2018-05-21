package com.example.domain;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Version;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties(value={"id", "version", "createdDate", "lastModifiedDate"}, ignoreUnknown=true, allowGetters=true)
public class User implements UserDetails {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(generator="uuid2")
	@GenericGenerator(name="uuid2", strategy="uuid2")
	@Column(columnDefinition="BINARY(16)")
	private UUID id;

	@JsonIgnore
	@Version
	private Long version;

	@Column(nullable=false, updatable=false)
	@CreatedDate
	private LocalDateTime createdDate;

	@Column(nullable=false)
	@LastModifiedDate
	private LocalDateTime lastModifiedDate;
	
	@Column(nullable=false, unique=true)
	@NotBlank
	private String username;
	
	@Email
	@Column(nullable=false, unique=true)
	@NotBlank
	private String email;

	@Column(nullable=true)
	@NotBlank
	private String lastName;
	
	@Column(nullable=true)
	@NotBlank
	private String middleName;
	
	@Column(nullable=true)
	@NotBlank
	private String firstName;
	
	@Column(nullable=true)
	@NotBlank
	private String phone;
	
	@Column(nullable=false)
	@NotBlank
	@JsonProperty(access = Access.WRITE_ONLY)
	private String password;
 
	@JsonIgnore
	@ManyToMany
	@JoinTable(name = "USER_ROLES",
		joinColumns = @JoinColumn(name="USER_ID", referencedColumnName="ID"),
		inverseJoinColumns = @JoinColumn(name="ROLE_ID", referencedColumnName="ID")) 
	private Set<Role> roles;
	
	public User addRole(Role role) {
		if (this.roles == null) { this.roles = new HashSet<Role>(); }
		this.roles.add(role);
		return this;
	}
	
	public User addRoles(Collection<Role> roles) {
		if (this.roles == null) { this.roles = new HashSet<Role>(); }
		this.roles.addAll(roles);
		return this;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
//		TODO: getAuthorities
//		Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
//		Set<Permission> permissions = new HashSet<Permission>();
//		this.getRoles().forEach(role -> { permissions.addAll(role.getPermissions()); });
//		permissions.forEach(permission -> { authorities.add(new SimpleGrantedAuthority(permission.getName())); });
		return null;
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}
}
