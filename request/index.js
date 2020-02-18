
let ajaxTimes=0;
export const request=(params)=>{
    ajaxTimes++;
    // 显示加载中
    wx.showLoading({
        title: '加载中',
        mask:true
      });
     
    // 定义功能的url
    const baseUrl ="https://api.zbztb.cn/api/public/v1";
    console.log(params);
    
    return new Promise((resolve,reject)=>{
        wx.request({
           ...params,
           url:baseUrl+params.url,
           success:(result)=>{
            resolve(result.data.message);
           },
           fail:(err)=>{
            reject(err);
           },
           complete:()=>{
            ajaxTimes--;
            if(ajaxTimes === 0) {
                wx.hideLoading();
            }
         
           }
        });
          
    });
}