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

import com.example.domain.Role
import com.example.domain.User
import com.example.service.UserService

@Controller
@RestController
class UserRestController {
	
	@Autowired
	private final UserService userService;

	@Transactional(readOnly=true)
	@RequestMapping(value="/user", method=RequestMethod.GET)
	HashMap<String, Object> get(HttpServletRequest request, HttpServletResponse response, @RequestParam("id") UUID id){
		Optional<Role> entity = userService.get(id);
		if (entity.isPresent()){
			User user = entity.get()
			HashMap<String, Object> data = [
//				uuid: user.uuid,
				id: user.id,
				username: user.username,
//				firstName: user.firstName,
//				middleName: user.middleName,
//				lastName: user.lastName,
//				fullName: user.fullName,
//				phone: user.phone,
				email: user.email,
//				agency: user.agency ? [
//					id: user.agency.id,
//					name: user.agency.name
//				] : null,
				roles: user.roles.collect({ Role role -> [
						id: role.id,
						name: role.name
					]})/*,
				currentUser: user.isCurrentUser(),
				details: user.getDetails().toMap()*/,
				details: true
			]
			return data
		}
		else { response.sendError(HttpStatus.NOT_FOUND.value()) }
	}
	
	@Transactional(readOnly=true)
	@RequestMapping(value="/user/list", method=RequestMethod.GET)
	public Iterable<User> list(HttpServletRequest request, HttpServletResponse response, Model model){
		List<User> users = userService.findAll().collect({ User user -> [
//			uuid: user.uuid,
			id: user.id,
			username: user.username,
//			firstName: user.firstName,
//			middleName: user.middleName,
//			lastName: user.lastName,
//			fullName: user.fullName,
//			phone: user.phone,
			email: user.email,
//			agency: user.agency ? [
//				id: user.agency.id,
//				name: user.agency.name
//			] : null,
			roles: user.roles.collect({ Role role -> [
					id: role.id,
					name: role.name
			]})/*,
			currentUser: user.isCurrentUser(),
			details: user.getDetails().toMap()*/
		]});
		return users;
	}
}
