define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
	
	if(!base.getUserId()){
		location.href="user/login.html"
	}
	
	var dtype;
	var start = 1;//第几页
	var startNum;//总页数
	var sum;////总条数
	var limitNum = 10;//每页个数
	var num=0;//已加载消息数
	
	var list = "";
	
	ajaxUpdata(start,limitNum);
	
	$(".updateMore").on("click",function(){
		
		if(start<startNum){
			start++;
			ajaxUpdata(start,limitNum);
		}else{
			start=start;
			$(".updateMore p").html("没有更多  ···")
		}
	})
	
	function ajaxUpdata(sta,lim){
		$.when(
			Ajax.get("802503"),
			base.getDictList("biz_type"),
			base.getDictList("jour_status")
		).then(function(res,res2,res3) {
            if (res.success && res2.success && res3.success) {
            	
            	accountNumber = res.data[0].accountNumber;
            	
            	var dict1 = res2.data;
            	var dict2 = res3.data;
            	
            	Ajax.get("802524",{"accountNumber":accountNumber,"start": sta,"limit": lim,"status": "effect_all"})
            	.then(function(res1) {
		            if (res1.success) {
		            	
		            	var dbizType;//类型
		            	var dbizNote;//说明
		            	var dDate;//日期
		            	var dtransAmount;//金额
		            	var dstutas;//状态
		            	
		            	startNum = res1.data.totalPage;//总页数
						sum = res1.data.totalCount;//总条数

		            	for (var i = 0; i < limitNum; i ++) {
					
							var s = "";
							
							if(num>sum-1){//消息加载总条数多余消息总条数时跳出循环
								num=num;
		//						console.log("已跳出循环,已加载消息条数"+num,"总消息条数"+sum);
								break;
								
							}else{
		//						console.log("已加载消息条数"+num,"总消息条数"+sum)
		
								dbizType = dictArray(res1.data.list[i].bizType,dict1),//类型
				            	dbizNote = res1.data.list[i].bizNote;//说明
				            	
				            	dDate = res1.data.list[i].createDatetime;
				            	dDate = base.formatDate(dDate, "yyyy-MM-dd");//日期
				            	
				            	dtransAmount = res1.data.list[i].transAmount/1000;
		        				dtransAmount = "￥"+dtransAmount.toFixed(2)//金额
		        				
		        				dstutas = dictArray(res1.data.list[i].stutas,dict1),//
								
				            	s+="<div class='plr10 ba ptb10 bb  clearfix'><div class='pb10'>";
								s+="<span class='state fs16'>"+dbizType+"</span>";
								s+="<span class='time fs15 '>"+dDate+"</span></div>";
								s+="<div class='p-rice fs18 pb10'>"+dtransAmount+"</div>";
								s+="<div class='finally fs15 '>"+dbizNote+"</div></div>";
								
								list += s;
								
								num++;
							}
						}
						
						$(".billWrap").html(list);
						
						if(num>sum-1){
							$(".updateMore p").html("没有更多  ···");
						}else{
				        	$(".updateMore p").html("加载更多  ···")
				        }
		            	
		            } else {
		                base.showMsg(res1.msg);
		            }
		        });
		        
            } else {
                base.showMsg(res.msg);
            }
        });
	}
	
	function dictArray(dkey,arrayData){//类型
		for(var i = 0 ; i < arrayData.length; i++ ){
			if(dkey == arrayData[i].dkey){
				return arrayData[i].dvalue;
			}
		}
	}
	
	
});
