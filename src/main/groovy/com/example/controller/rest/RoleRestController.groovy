package com.example.controller.rest

import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Controller
import org.springframework.transaction.annotation.Transactional
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import com.example.domain.Permission
import com.example.domain.Role
import com.example.domain.User
import com.example.service.RoleService
import com.example.service.UserService

@Controller
@RestController
class RoleRestController {

	@Autowired
	private final UserService userService;

	@Autowired
	private final RoleService roleService;

	@Transactional(readOnly=true)
	@RequestMapping(value="/role", method=RequestMethod.GET)
	HashMap<String, Object> get(HttpServletRequest request, HttpServletResponse response, @RequestParam("id") UUID id){
		Optional<Role> entity = roleService.get(id);
		if (entity.isPresent()){
			Role role = entity.get()
			Collection<User> users = userService.findAll()
			Collection<User> usersWithRole = userService.findAllByRole(role)
			users.removeAll(usersWithRole)
			HashMap<String, Object> data = [
				role: [
					id: role.id,
					name: role.name,
					permissions: role.permissions.collect({ Permission permission -> [
						id: permission.id,
						name: permission.name
					]})
				],
				users: usersWithRole.collect({ User user -> [ id: user.id, username: user.username ]}),
				avalibleUsers: users.collect({ User user -> [ id: user.id, username: user.username ]})
			]
			return data
		}
		else { response.sendError(HttpStatus.NOT_FOUND.value()) }
	}
	
	@Transactional(readOnly=true)
	@RequestMapping(value="/role/list", method=RequestMethod.GET)
	public Iterable<Role> list(HttpServletRequest request, HttpServletResponse response, Model model){
		List<Role> roles = roleService.findAll().collect({ Role role -> [
			id: role.id,
			name: role.name
		]});
		return roles;
	}
}
