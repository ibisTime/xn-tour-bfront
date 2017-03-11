define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
	if(!base.getUserId()){
		location.href="user/login.html"
	}
    var dhotalCode;
    var dhcode = base.getUrlParam("hcode");
	var dhref = base.getUrlParam("code");
	
	$.when(
		Ajax.get("618032",{"code":dhref}),
		// base.getDictList("hh_type"),
        base.getDictList("htorder_status"),
        base.getDictList("ss_type")
	).then(function(res1, res3, res4){
		if (res1.success && res3.success && res4.success) {

        	var dict2 = res3.data;
        	var dict3 = res4.data;
        	var dstatus ,//状态
        		dtype ,//类型
        		dpicture ,//图片
        		dprice, //价格
        		droomNum, //房号
        		ddescription,//描述
        		dDate;//描述

        		var s = "";
            	dtype = res1.data.name,//类型
                dprice = res1.data.price/1000;
            	dprice = "￥"+dprice.toFixed(2);//价格
            	droomNum = res1.data.totalNum;//房间编号
            	dhotalCode = res1.data.hotalCode;
        		
        		ddescription = res1.data.description;
        		ddescription = dictArray2(ddescription,dict3);//描述
        		
        		dDate = base.formatDate(res1.data.startDate,"yyyy-MM-dd")+"至"+base.formatDate(res1.data.endDate,"yyyy-MM-dd");
        		
        		dstatus = "已入住，待退房";

				s += "<div class='pl10 fs15 ba'><div class='ptb18 border-b mt10'>"+dtype+"</div>";
				s += "<div class='ptb18 border-b'>"+dDate+"</div>";//入住时间
				s += "<div class='ptb18 border-b'>"+ddescription+"</div>";
				s += "<div class='ptb18 border-b'>"+dprice+"</div>";
				s += "<div class='ptb18  mb10'>"+dstatus+"</div></div>";
        	
        	$(".manageWrap").html(s);
        } else {
            base.showMsg(res1.msg);
        }
	});
	
	$("#btn-checkOut").on("click",function(){
		
		var pwd = $(".checkIn-pwd").val();
        var userId = base.getUserId();
		
		if(pwd=="" ){
			base.showMsg("密码不能为空");
		}else{
			var parem = {
	            "owerId": userId,
				"hotalOrderCode": dhcode,
				"password": pwd,
	            "updater":userId
			}
			Ajax.post("618047",{json:parem})
				.then(function(res) {
	                if (res.success) {
	                    base.goBackUrl("roomManagement.html?code="+dhotalCode);
	                } else {
	                    base.showMsg(res.msg);
	                }
	            }, function() {
	                base.showMsg("退房失败");
	            })
		}
		
		
		
	})
	
	function dictArray(dkey,arrayData){//类型
		for(var i = 0 ; i < arrayData.length; i++ ){
			if(dkey == arrayData[i].dkey){
				return arrayData[i].dvalue;
			}
		}
	}
	function dictArray2(dkeys,arrayData){//描述
	    var str = dkeys;
		var arr = str.split(',');
		var temp = "";
		for (var i=0;i<arr.length;i++)
		{
			temp = temp + " " +dictArray(arr[i]*1,arrayData)
		}
        return temp;
	}
});
