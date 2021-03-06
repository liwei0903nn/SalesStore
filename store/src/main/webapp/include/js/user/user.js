var datagridD;
// 初始化datagrid

datagridD = [{
	field : 'id',
	title : '编号',
	//hidden : true,
	width : 50
}, {
	field : 'username',
	title : '用户名',
	width : 200,
	align : 'center'
},{
	field : 'realname',
	title : '真实姓名',
	width : 100,
	align : 'center'
},{
	field : 'province',
	title : '省份',
	width : 100,
	align : 'center'
},{
	field : 'role_name',
	title : '角色名称',
	width : 100,
	align : 'center'
},{
	field : 'parseDate',
	title : '最后登录日期',
	width : 140,
	align : 'center'
}

];

var tabrs;
tabrs = [ {

	text : '查询',
	iconCls : 'icon-search',
	handler : function() {
		queryUser();
	}

}, '-', {
	text : '删除',
	iconCls : 'icon-remove',
	handler : function() {
		removeUser();
	}
}, '-', {
	text : '编辑',
	iconCls : 'icon-edit',
	handler : function() {
		modifyUser();
	}
} 
];

function queryUser(){
	$("#queryUserWin").window("open") ;
}
function add(){
	$("#role_id_add").combobox({
		url:"user/getAllRoles",
		valueField : "id" ,
		textField:"role_name"
			
	}) ;
	$("#addUserWin").window("open") ;
}

function submitQuery(){
	var type = $("#type").val() ;//获取类型 1是普通会员  2是供应商  3客户经理
	var username = $("#username_query").val() ;
	var realname = $("#realname_query").val() ;
	if(username==""){
		username=undefined;
	}
	if(realname ==""){
		realname=undefined;
	}
	var json ={
		"username":username,
		"realname":realname
	};
	$("#user_list").datagrid('options').url = 'user/getUserList?type='+type;
	$("#user_list").datagrid('options').queryParams = json;
	$("#user_list").datagrid('load');
	$('#queryUserWin').window("close");
	
}

function modifyUser(){
	
	$("#role_id_edit").combobox({
		 url:'user/getAllRoles',    
	     valueField:'id',    
	     textField:'role_name'
	});
	
	var target = $('#user_list').datagrid('getSelections');
	if (target.length < 1) {
		$.messager.show( {
			msg : '请选择一条数据进行修改!',
			title : '提示'
		});
	}else if(target.length >1){
		$.messager.show( {
			msg : '只能选择一条数据进行修改!',
			title : '提示'
		});
	}else{
		$("#role_id_edit").combobox('setValue',target[0].role_id);
		$("#modifyUserWin").window("open") ;
		$("#username_edit").val(target[0].username);
		$("#realname_edit").val(target[0].realname);
		$("#province_edit").combobox("setValue",target[0].province);
	}
}

function closeWin(obj){
	$("#"+obj).window('close') ;
}
/**
 * 保存修改
 */
function saveEdit(){
	var target = $('#user_list').datagrid('getSelections');
	var role_id = $("#role_id_edit").combobox('getValue');
	var username = $("#username_edit").val() ;
	var realname = $("#realname_edit").val() ;
	var province = $("#province_edit").combobox("getValue");
	if(username =="" || realname == ""){
		$("#showMsg_edit").html("请将数据填写完整");
		return ;
	}else{
		$("#showMsg_edit").html("");
	}
	var json ={
		"id":target[0].id,
		"username":username,
		"role_id":role_id,
		"realname":realname,
		"province":province
	}
	
    $.ajax({            
        type:"POST",   //post提交方式默认是get
        url:"user/edit", 
        data:json, 
        error:function(request) {      // 设置表单提交出错                 
            $("#showMsg").html(request);  //登录错误提示信息
        },
        success:function(data) {
        	  if(data=="false"){
        	  	  $("#showMsg_edit").html("系统错误");
        	  	  return ;
        	  }else{
        		  	$("#user_list").datagrid('reload');	
        		  	$("#modifyUserWin").window("close") ;
        			$.messager.show( {
        				msg : '修改成功',
        				title : '提示'
        			});
        	  }
        }            
  });
}
/**
 * 新增用户之前的验证
 */
function turnToAdd(){
	var username = $("#username_add").val() ;
	var realname = $("#realname_add").val() ;
	var remark = $("#remark_add").val() ;
	var pwd1 = $("#pwd1").val() ;
	var pwd2 = $("#pwd2").val() ;
	var role_id = $("#role_id_add").combobox("getValue") ;
	if(username =="" || realname == "" || remark =="" || pwd1 == "" || pwd2 ==""){
		$("#showMsg").html("请将数据填写完整");
		return ;
	}else{
		$("#showMsg").html("");
	}
	if(pwd1 != pwd2){
		$("#showMsg").html("两次密码输入不同！");
		return ;
	}else{
		$("#showMsg").html("");
	}
	
	var json = {
		"username": username,
		"realname":realname,
		"remark":remark,
		"password":pwd1,
		"role_id":role_id
	};

    $.ajax({            
        type:"POST",   //post提交方式默认是get
        url:"user/create", 
        data:json, 
        error:function(request) {      // 设置表单提交出错                 
            $("#showMsg").html(request);  //登录错误提示信息
        },
        success:function(data) {
        	  if(data=="false"){
        	  	  $("#showMsg").html("系统错误");
        	  	  return ;
        	  }else{
        		  	$("#user_list").datagrid('reload');	
        		  	$("#addUserWin").window("close") ;
        			$.messager.show( {
        				msg : '新增成功',
        				title : '提示'
        			});
        	  }
        }            
  }); 
}

//删除数据
function removeUser() {

	var list = new Array();
	var rows = $('#user_list').datagrid('getSelections');
	if (rows.length != 0) {
		$.messager.confirm('询问', '您确定要删除所选中的数据吗?', function(answer) {
			if (answer) {
				for ( var i = 0; i < rows.length; i++) {
					list.push(rows[i].id);
				}
				$.ajax( {
					type:"POST", 
					url : 'user/delete?ids=' + list + '',
					cache : false,
					success : function(r) {
					$("#user_list").datagrid('clearSelections'); // 清空选择状态
					$("#user_list").datagrid('reload');
					$.messager.show( {
						msg : "删除成功！",
						title : '提示'
					});
				}
				});
			}
		});
	} else {
		$.messager.show( {
			msg : '请至少选中一行!',
			title : '提示'
		});
	}

}

$(function(){
	var type = $("#type").val() ;//获取类型 1是普通会员  2是供应商  3客户经理
	
	$("#addUserWin").window("close") ;
	$("#modifyUserWin").window("close") ;
	$("#queryUserWin").window("close") ;
	$('#user_list').datagrid({
		url : "user/getUserList?type="+type, // 这里可以是个json文件，也可以是个动态页面，还可以是个返回json串的function
		frozenColumns : [ [ {
			field : 'ck',
			checkbox : true
		} ] ],
		columns : [ datagridD ],
		rownumbers : true,
		idField : 'id',
		striped : true,
		pageSize : 25,
		pageList : [ 5,25, 35, 45, 55 ],
		nowrap : true,
		loadMsg : '数据加载中...请稍等',
		pagination : true,
		height : 'auto',
		fit : true,
		toolbar : '#tabrs',
		border : false,
		onDblClickRow : function(rowIndex, rowData) {

		}
	});
}) ;

function formClear(obj){
	$("#"+obj).form("clear") ;
}
