package com.example.domain;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Version;
import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
public class Permission {
	
	@Id
	@GeneratedValue(generator="UUID")
	@GenericGenerator(name="UUID", strategy="org.hibernate.id.UUIDGenerator")
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
	private String name;
	
//	@Column(nullable=false, unique=true)
//	@NotBlank
//	private String authority;
 
//	@JsonIgnore
//	@ManyToMany(mappedBy="permissions")
//	private Set<Role> roles;
	
}
