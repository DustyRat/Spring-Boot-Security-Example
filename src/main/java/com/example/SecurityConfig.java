package com.example;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.springframework.beans.factory.BeanInitializationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled=true)
@Order(SecurityProperties.BASIC_AUTH_ORDER)
class SecurityConfig extends WebSecurityConfigurerAdapter {
	
//	@Autowired
//	private DataSource dataSource;
	
	@Autowired
	private UserDetailsService userDetailsService;
	
//	@Autowired
//	private AuthenticationManagerBuilder auth;

	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
//		auth.userDetailsService(userDetailsService);
//		auth.jdbcAuthentication().dataSource(dataSource);
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
	}
	
//	@PostConstruct
//    public void init() throws Exception {
//        try {
//        	auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
//        } catch (Exception e) {
//            throw new BeanInitializationException("Security config failure", e);
//        }
//    }

	@Override
	public void configure(WebSecurity web) throws Exception {
		System.out.println("Configuring WebSecurity");
		web.ignoring()
				.antMatchers("/assets/**")
				.antMatchers("/error")
				.antMatchers("/resources/**")
				.antMatchers("/static/**")
				.antMatchers("/**/js/**")
				.antMatchers("/**/css/**")
				.antMatchers("/**/images/**")
				.antMatchers("/**/favicon.ico");
		
		web.ignoring().antMatchers("/h2-console/**");
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		System.out.println("Configuring HttpSecurity");
		http
			.authorizeRequests()
				.antMatchers("/signup","/about").permitAll()
				.antMatchers("/admin/**").hasRole("ADMIN")
				.anyRequest().authenticated()
				.and()
			.formLogin()
//				.loginPage("/login")
				.permitAll();
		
//		http.authorizeRequests().antMatchers("/h2-console/**").permitAll();
		http.csrf().disable();
		http.headers().frameOptions().disable();
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
