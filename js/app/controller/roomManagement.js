define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {

	if(!base.getUserId()){
		location.href="user/login.html"
	}

	var userId = base.getUserId();
	var hotalCode = base.getUrlParam("code");
	var start = 1;//第几页
	var startNum;//总页数
	var sum;////总条数
	var limitNum = 10;//每页个数
	var num=0;//已加载消息数

	var list = "";

	ajaxUpdata(start,limitNum);

	$("#manageWrap").on("click", ".manageList", function(e){
		var va = $(this);
		var code = va.attr("data-code");
		var hcode = va.attr("data-hcode");
        var dapplyNote = va.attr("data-aN");//要求
		var hstatus =  va.attr("data-hstatus");

        if(hstatus==1){//1 已支付待入住

            location.href = "checkIn.html?code="+code+"&hcode="+hcode+"&aN="+dapplyNote;
        }else if(hstatus==11){//11 未预订

            location.href = "checkIn.html?code="+code+"&hstatus="+hstatus;
        }else if(hstatus==32){//32 已入住待退房

            location.href = "checkOut.html?code="+code+"&hcode="+hcode;
        }
	});

	//加载
	$(".updateMore").on("click",function(){
		if(start<startNum){
			start++;
			ajaxUpdata(start,limitNum);
		}else{
			start=start;
			$(".updateMore p").html("没有更多  ···");
		}
	})

	function ajaxUpdata(sta,lim){
		$.when(
//			Ajax.get("618031",{"hotalCode":hotalCode}),

			Ajax.get("618034",{"hotalCode":hotalCode,"start":sta,"limit": lim}),
			// base.getDictList("hh_type"),//房型
            base.getDictList("htorder_status"),//状态
	        base.getDictList("ss_type")
		).then(function(res1,  res3, res4){
			if (res1.success && res3.success && res4.success) {
				if(res1.data.list.length>0){
					console.log(res1.data)
					var dict2 = res3.data;
					var dict3 = res4.data;
					var dstatus ,//状态
						dtype ,//类型
						dpicture ,//图片
						dprice, //价格
						droomNum, //房号
						ddescription,//描述
						dDate;

					startNum = res1.data.totalPage;//总页数
					sum = res1.data.totalCount;//总条数

					for (var i = 0; i < limitNum; i ++) {

						var s = "";

						if(num>=sum){//消息加载总条数多余消息总条数时跳出循环
							num=num;
	//						console.log("已跳出循环,已加载消息条数"+num,"总消息条数"+sum)
							break;
						}else{
	//						console.log("已加载消息条数"+num,"总消息条数"+sum)

							dtype = res1.data.list[i].name,//类型
							dpicture = res1.data.list[i].picture.split("||")[0];//图片
							dprice = res1.data.list[i].price/1000;
							dprice = "￥"+dprice.toFixed(2);//价格
							dtotalNum = res1.data.list[i].totalNum ;//房号

							ddescription = res1.data.list[i].description || "";
							ddescription = dictArray2(ddescription,dict3);//描述

							dDate = base.formatDate(res1.data.list[i].startDate,"yyyy-MM-dd")+"至"+base.formatDate(res1.data.list[i].endDate,"yyyy-MM-dd");

							if(res1.data.list[i].status == 1){//跳转可入住

								dstatus = "已支付，待入住";//状态status=1

								s += "<div data-code='"+res1.data.list[i].code+"' data-hstatus='"+res1.data.list[i].status+"' data-hcode='"+res1.data.list[i].hotalOrderCode+"' data-aN='"+res1.data.list[i].applyNote+"' class='manage ba lh19 bb manageList manageListOut over-hide' >";
								s += "<div class='image inline_block fl'><img src='"+PIC_PREFIX+dpicture+THUMBNAIL_SUFFIX+"'></div>";
								s += "<div class='inline_block pl10 fl'><div class='room-style mb6'>"+dtype+"</div>";
								s += "<div class='room-number'>"+dDate+"</div>";
								s += "<div class='room-point'>"+ddescription+"</div>";
								s += "<div class='price mt6'>"+dprice+"</div></div>";
								s += "<div class='back fs14'>"+dstatus+"</div></div>";

							}else if(res1.data.list[i].status==11){//跳转可入住

                                dstatus = "未预订";//状态status=11

                                s += "<div data-code='"+res1.data.list[i].code+"' data-hstatus='"+res1.data.list[i].status+"' class='manage ba lh19 bb manageList manageListOut over-hide'>";
                                s += "<div class='image inline_block fl'><img src='"+PIC_PREFIX+dpicture+THUMBNAIL_SUFFIX+"'></div>";
                                s += "<div class='inline_block pl10 fl'><div class='room-style mb6'>"+dtype+"</div>";
                                s += "<div class='room-number'>"+dDate+"</div>";
                                s += "<div class='room-point'>"+ddescription+"</div>";
                                s += "<div class='price mt6'>"+dprice+"</div></div>";
                                s += "<div class=' back fs14'>"+dstatus+"</div></div>";

                            }else if(res1.data.list[i].status == 32){
                                dstatus = "已入住,待退房";//状态status=11

								s += "<div data-code='"+res1.data.list[i].code+"' data-hstatus='"+res1.data.list[i].status+"' data-hcode='"+res1.data.list[i].hotalOrderCode+"' class='manage ba lh19 bb manageList manageListIn over-hide'>";
								s += "<div class='image inline_block fl'><img src='"+PIC_PREFIX+dpicture+THUMBNAIL_SUFFIX+"'></div>";
								s += "<div class='inline_block pl10 fl'><div class='room-style mb6'>"+dtype+"</div>";
								s += "<div class='room-number'>"+dDate+"</div>";
								s += "<div class='room-point'>"+ddescription+"</div>";
								s += "<div class='price mt6'>"+dprice+"</div></div>";
								s += "<div class='check-in fs14'>"+dstatus+"</div></div>";
							}
							list += s;
							num ++;
						}
					}

					$(".manageWrap").html(list);

					if(num>sum-1){
						$(".updateMore p").html("没有更多  ···");
					}else{
						$(".updateMore p").html("加载更多  ···")
					}

				}
	        } else {
	            base.showMsg(res1.msg);
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
	function dictArray2(dkeys,arrayData){//描述
	    var str = dkeys;
		var arr = str.split(",");
		var temp = "";
		for (var i=0;i<arr.length;i++)
		{
			temp = temp + " " +dictArray(arr[i]*1,arrayData)
		}
        return temp;
	}

});
