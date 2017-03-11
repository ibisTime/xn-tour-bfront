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
	var timer ;
	
	var codeTimeNum=60;
	var tradePwdStrength;
	
	Ajax.get("618011",{"ownerId":userId})
		.then(function(res) {
            if (res.success) {
                code = res.data[0].code;
            } else {
                base.showMsg(res.msg);
          }
        })
	
	Ajax.get("805056",{"userId":userId})
		.then(function(res) {
            if (res.success) {
            	
    			tradePwdStrength = res.data.tradePwdStrength;
            	
            } else {
            }
        }, function() {
            base.showMsg("验证失败");
        });
	
	//手机号验证码
	$("#newTelCode").on("click",function(){
		
		
		var newTel = $(".revise-Tel").val();
		
		if(newTel==null || newTel=="" ){
			base.showMsg("请输入手机号");
		}else if(newTel.length!=11){
			base.showMsg("请输入正确的手机号");
		}else{
			
			if(codeTimeNum==60){
				
				timer = setInterval(function(){
					codeTimeNum--;
					
					$("#newTelCode").css({"color":"#999"})
					$("#newTelCode").html("重新发送("+codeTimeNum+")");
					
					if(codeTimeNum<0){
						clearInterval(timer);
						codeTimeNum=60;
						$("#newTelCode").css({"color":"#595959"});
						$("#newTelCode").html("获取验证码");
					}
				},1000);
				
				var bizType;
				
				if(tradePwdStrength){
					bizType = 805057;
				}else{
					bizType = 805045;
				}
				var parem={
					"mobile":newTel,
					"bizType":bizType,
		            "kind": "f2"
				}
				
				Ajax.post("805904",{json:parem})
					.then(function(res) {
		                if (res.success) {
		                } else {
		                }
		            }, function() {
		                base.showMsg("验证失败");
		            });
			}
		}
	})
	
	//-----------------交易密码-----------------
	
	//确定提交
	$("#reviseSub").on("click",function(){
		var newTel = $(".revise-Tel").val();
		var newCode = $(".newTelCode").val();
		var tradePwd = $(".revise-NPwd").val();//新交易密码
		var tradePwd2 = $(".revise-NPwd2").val();//确认交易密码
		
		if(newTel==null || newTel=="" ){
			base.showMsg("请输入手机号");
		}else if(newTel.length!=11){
			base.showMsg("请输入正确的手机号");
		}else if(newTel.length!=11){
			base.showMsg("请输入正确的手机号");
		}else if(newCode==null || newCode==""){
			base.showMsg("请输入手机验证码");
		}else if(tradePwd!=tradePwd2){
			base.showMsg("两次密码输入不一致");
			
			$(".revise-NPwd").val("");//新交易密码
			$(".revise-NPwd2").val("");//确认交易密码
			
		}else if(newCode.length!=4){
			base.showMsg("手机验证码不正确");
		}else if(tradePwd==null || newCode==""){
			base.showMsg("请输入交易密码");
		}else {
			
			if(tradePwdStrength){//找回
				var parem={
					"userId": userId, 
				    "newTradePwd": tradePwd,
				    "tradePwdStrength": base.calculateSecurityLevel(tradePwd),
					"smsCaptcha": newCode,
				}
				
				Ajax.post("805057",{json:parem})
					.then(function(res) {
		                if (res.success) {
		                	if(res.data.isSuccess){
								location.href="security.html?code="+code;
		                	}
		                } else {
		                	base.showMsg("验证失败");
		                }
		            }, function() {
		                base.showMsg("验证失败");
		            });
			}else{//设置
				
				var parem={
					"userId": userId, 
				    "tradePwd": tradePwd,
				    "tradePwdStrength": base.calculateSecurityLevel(tradePwd),
					"smsCaptcha": newCode,
				}
				
				Ajax.post("805045",{json:parem})
					.then(function(res) {
		                if (res.success) {
		                	if(res.data.isSuccess){
		                		base.logout();
								location.href = "user/login.html"
		                	}
		                } else {
		                	base.showMsg("验证失败");
		                }
		            }, function() {
		                base.showMsg("验证失败");
		            });
			}
			
			
			
		}
	});
	
});