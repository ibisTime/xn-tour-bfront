define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/loading'
], function(base, Ajax, loading) {
	
	if(!base.getUserId()){
		location.href="user/login.html"
	}
	
	Ajax.get("807717",{"ckey":"aboutus"})
		.then(function(res){
			if(res.success){
				$("#aboutUs").html(res.data.note);
			} else {
                base.showMsg(res.msg);
            }
        }, function() {
            base.showMsg("入住失败");
        })
	
});
