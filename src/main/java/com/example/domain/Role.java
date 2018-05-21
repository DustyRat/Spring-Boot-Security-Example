package com.example.domain;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Version;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.example.audit.Auditable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=false)
@Entity
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties(value={"id", "version", "createdDate", "lastModifiedDate"}, ignoreUnknown=true, allowGetters=true)
public class Role extends Auditable<String> {
	
	@Id
	@GeneratedValue(generator="UUID")
	@GenericGenerator(name="UUID", strategy="org.hibernate.id.UUIDGenerator")
	private UUID id;
	
	@JsonIgnore
	@Version
	private Long version;
 
	private String name;
	
//	@JsonIgnore
//	@ManyToMany(mappedBy = "roles")
//	private Set<User> users;
 
	@JsonIgnore
	@ManyToMany
	@JoinTable(name = "roles_permissions",
		joinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"), 
		inverseJoinColumns = @JoinColumn(name = "permission_id", referencedColumnName = "id"))
	private Set<Permission> permissions;

	public Role addPermission(Permission permission) {
		if (this.permissions == null) { this.permissions = new HashSet<Permission>(); }
		this.permissions.add(permission);
		return this;
	}

	public Role addPermissions(Collection<Permission> permissions) {
		if (this.permissions == null) { this.permissions = new HashSet<Permission>(); }
		this.permissions.addAll(permissions);
		return this;
	}
	
//	public Role addUser(User user) {
//		if (this.users == null) { this.users = new HashSet<User>(); }
//		this.users.add(user);
//		return this;
//	}
//
//	public Role addUsers(Collection<User> users) {
//		if (this.users == null) { this.users = new HashSet<User>(); }
//		this.users.addAll(users);
//		return this;
//	}
	
}
