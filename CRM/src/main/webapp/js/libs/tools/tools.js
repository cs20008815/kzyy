/**
 * Created by Administrator on 2017/5/22.
 */
var tools = {
    toDate : function(date){
        return new Date(date).Format("yyyy-MM-dd hh:mm:ss");
    },
    getBHQ : function(date){
        var nowDate = new Date();
        var lastDate = new Date(date);
        lastDate.setDate(lastDate.getDate()+7);
        if(nowDate.getTime() > lastDate.getTime()){
            return "<div style='color: #b12b37'>保护期外</div>";
        }
        return "<div style='color: #0d8f6b'>保护期内</div>";
    }
};
