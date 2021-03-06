package com.work.intercept;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.work.entity.Function;
import com.work.entity.User;
import com.work.service.FunctionService;
import com.work.service.RoleService;


public class Intercept implements HandlerInterceptor {

	private static Logger logger = Logger.getLogger(Intercept.class) ;
	
	@Autowired
	private FunctionService functionService ;
	
	@Autowired
	private RoleService roleService ;
	/**
	 * 第一次执行
	 */
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
			Object handler) throws Exception {
		User user = (User) request.getSession().getAttribute("user") ;
		String url = request.getRequestURI() ;
		url = url.substring(7) ;
		logger.debug("当前URL------>  "+url);
		System.out.println("当前URL------>  "+url);
		if(user != null){
			String role_id = user.getRole_id() ;
			if(role_id != null){
				//说拥有的所有权限ID
				String function_id = roleService.get(Integer.parseInt(role_id)).getFunction_id() ;
				if(function_id == null){
					function_id ="" ;
				}
				Function function = new Function() ;
				function.setFunction_url(url) ;
				List<Function> list = functionService.findAll(function) ;
				if(list.size() <=0){
					return true ;
				}else{
					Function f = functionService.findAll(function).get(0) ;
					String currenId = f.getId()+"" ;
					if(function_id.indexOf(currenId) == -1){
						response.sendRedirect("/store/notfound.jsp") ;
						response.getWriter().print("false") ;
						logger.debug("当前状态------>  无权限 ");
						System.out.println("当前状态------>  无权限 ");
						return false ;
					}else {
						logger.debug("当前状态------>  通过 ");
						System.out.println("当前状态------>  通过 ");
						return true ;
					}
					
				}
			}
			
			return true;
		}else {
			logger.debug("当前状态------>  拦截 ");
			System.out.println("当前状态------>  拦截 ");
			response.sendRedirect("/store/login.jsp") ;
//			request.getRequestDispatcher("/login.jsp").forward(request, response);  
			return false ;
		}
	}

	
	
	/**
	 * 最后执行 用于关闭资源
	 */
	public void afterCompletion(HttpServletRequest arg0,
			HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {
	}

	/**
	 * 渲染视图时执行
	 */
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1,
			Object arg2, ModelAndView arg3) throws Exception {
	}

}
