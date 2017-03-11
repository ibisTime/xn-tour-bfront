define([], function() {
    var dict = {
        hotelOrderStatus: {
            "1": "待支付",
            "2": "已支付",
            "3": "已入住",
            "4": "已退房",
            "5": "已完成",
            "6": "待退款",
            "7": "退款成功",
            "8": "退款失败",
            "9": "已申请退款",
            "91": "用户异常",
            "92": "商户异常"
        }
    };

    return {
        get: function(code) {
            return dict[code];
        }
    }
});