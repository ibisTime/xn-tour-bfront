define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
	if(!base.getUserId()){
		location.href="user/login.html"
	}
	
	var userId = base.getUserId();
	var code;
	var userName;//用户名
	var userPic;//头像
	
	var userImg = __inline("../images/headimg.png");
	Ajax.get("618011",{"ownerId":userId})
		.then(function(res) {
            if (res.success) {
//          	console.log(res.data[0])
                code = res.data[0].code;
                userName = res.data[0].name;
                userPic = res.data[0].pic1;
                
                $("#userName").html(userName);
                
                if(userPic != null || userPic==""){
                	$("#userPic").attr("src",PIC_PREFIX+userPic+THUMBNAIL_INDEX)
               	}else{
                	$("#userPic").attr("src",userImg)
               	}
            } else {
                base.showMsg(res.msg);
            }
        })

	$("#h-ReportQuery").on('click', function(){
		location.href = "reportQuery.html"
	});
	
	$("#h-roomManagement").on('click', function(){
		location.href = "roomManagement.html?code="+code;
	});
	
	$("#h-aboutUs").on('click', function(){
		location.href = "aboutUs.html?code="+code;
	});
	
	$("#h-system").on('click', function(){
		location.href = "systemNotice.html"
	});
	
	$("#h-icon-account").on('click', function(){
		location.href = "security.html?code="+code;
	});
	
	//退出登录
	$("#btn-SignOut").on('click', function(){
		base.logout();
		location.href = "user/login.html"
	});
	
	$("#revise-tel").on('click', function(){
		location.href = "reviseTel.html?code="+code;
	});
	
	$("#revise-pwd").on('click', function(){
		location.href = "revisePwd.html?code="+code;
	});
	
	$("#revise-tpwd").on('click', function(){
		location.href = "revisetPwd.html?code="+code;
	});
	
});