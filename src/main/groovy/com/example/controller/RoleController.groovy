package com.example.controller

import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam

import com.example.service.RoleService

@Controller
//@RestController
class RoleController {
	
	@Autowired
	private final RoleService service;
	
	@RequestMapping("/roles")
	String list(Model model){
		return "role/list";
	}
	
	@RequestMapping("/role/edit")
	String edit(HttpServletRequest request, HttpServletResponse response, @RequestParam("id") UUID id){
		if (service.exists(id)){ return "role/edit" }
		else { response.sendError(HttpStatus.NOT_FOUND.value()) }
	}
	
//	@RequestMapping("/role/create")
//	String create(){
//		return "role/create";
//	}
//
//
//	def listUsers(){ }
//
//	@Transactional
//	def save(Role role){
//		List<String> list = params.list('addUsers')
//		if (!list.isEmpty()){ addUsers(role, list) }
//		
//		role.save(flush: true, failOnError: true)
//		render status: OK
//	}
//
//	@Transactional
//	def update(Role role){
//		if (role){
//			List<String> list = params.list('addUsers')
//			if (!list.isEmpty()){ addUsers(role, list) }
//
//			list = params.list('removeUsers')
//			if (!list.isEmpty()){ removeUsers(role, list) }
//			
//			role.save(flush: true, failOnError: true)
//			render status: OK
//		}
//		else { return response.sendError(NOT_FOUND.value()) }
//	}
//
//	@Transactional
//	def delete(Role role){
//		if (role){
//			List<User> batch = []
//			role.getUsers().each { User user ->
//				if (user.roles.contains(role)){
//					user.removeFromRoles(role)
//					user.clearCachedAuthorizationInfo()
//					batch.add(user)
//					if (batch.size() >= 50){
//						User.withTransaction { TransactionStatus status ->
//							batch.each { User u -> u.save(failOnError: true) }
//						}
//						batch.clear()
//					}
//				}
//			}
//			if (!batch.isEmpty()){
//				User.withTransaction { TransactionStatus status ->
//					batch.each { User u -> u.save(failOnError: true) }
//				}
//				batch.clear()
//			}
//
//			role.delete(flush: true, failOnError: true)
//			render status: NO_CONTENT
//		}
//		else { return response.sendError(NOT_FOUND.value()) }
//	}
//	
//	private void addUsers(Role role, List<String> list){
//		List<User> batch = []
//		int size = list.size(), max = size > 500 ? 500 : size, fromIndex = 0, toIndex = 0
//		User.withSession { Session session ->
//			while (size > toIndex){
//				toIndex += max
//				if (toIndex > size){ toIndex = size }
//				List<String> subList = list.subList(fromIndex, toIndex)
//				if (!subList.isEmpty()){
//					User.findAllByIdInList(subList).each { User user ->
//						if (!user.roles.contains(role)){
//							user.addToRoles(role)
//							user.clearCachedAuthorizationInfo()
//							batch.add(user)
//							if (batch.size() >= 50){
//								User.withTransaction { TransactionStatus status ->
//									batch.each { User u -> u.save(failOnError: true) }
//								}
//								batch.clear()
//							}
//						}
//					}
//				}
//				fromIndex = toIndex
//			}
//			if (!batch.isEmpty()){
//				User.withTransaction { TransactionStatus status ->
//					batch.each { User u -> u.save(failOnError: true) }
//				}
//				batch.clear()
//			}
//		}
//	}
//	
//	private void removeUsers(Role role, List<String> list){
//		List<User> batch = []
//		int size = list.size(), max = size > 500 ? 500 : size, fromIndex = 0, toIndex = 0
//		User.withSession { Session session ->
//			while (size > toIndex){
//				toIndex += max
//				if (toIndex > size){ toIndex = size }
//				List<String> subList = list.subList(fromIndex, toIndex)
//				if (!subList.isEmpty()){
//					User.findAllByIdInList(subList).each { User user ->
//						if (user.roles.contains(role)){
//							user.removeFromRoles(role)
//							user.clearCachedAuthorizationInfo()
//							batch.add(user)
//							if (batch.size() >= 50){
//								User.withTransaction { TransactionStatus status ->
//									batch.each { User u -> u.save(failOnError: true) }
//								}
//								batch.clear()
//							}
//						}
//					}
//				}
//				fromIndex = toIndex
//			}
//			if (!batch.isEmpty()){
//				User.withTransaction { TransactionStatus status ->
//					batch.each { User u -> u.save(failOnError: true) }
//				}
//				batch.clear()
//			}
//		}
//	}
}
