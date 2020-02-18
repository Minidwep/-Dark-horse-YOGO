// pages/category/index.js
import {
  request
} from "../../request/index";

import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧的商品数据
    rightContent:[],
    //接口返回的数据
    cates:[],
    //被点击的左侧菜单
    currentIndex:0

  },
  scrollTop:0
  ,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
      1 先判断一下本地存储中有没有旧的数据
      {time:Data.now(),data:[...]}
      2 没有旧数据 直接发送新请求
      3 有旧数据 同时 旧的数据也没有过期 就使用 本地存储中的数据即可
    */
      // 1 获取本地存储中的数据
      const cates = wx.getStorageSync("cates");
      // 2 判断
      if(!cates){
        // 不存在 发送请求获得数据
        this.getCates();
      } else {
        // 有旧的数据 定义过期时间
        if(Date.now()-cates.time > 1000*10){
          //重新发送请求
          this.getCates();
        } else {
          //可以使用旧的数据
          this.cates = cates.data;
          let leftMenuList = this.cates.map(v=>v.cat_name);
          let rightContent = this.cates[0].children;
          this.setData({
            leftMenuList,
            rightContent
          })
        }
      }
  },
  // getCates(){
  //   request({
  //     url:"/categories"
  //   }).then(res=>{
  //       this.cates=res.data.message;
  //       // 吧接口的数据存入本地
  //       wx.setStorage({
  //         key: 'cates',
  //         data: {time:Date.now(),data:this.cates},
  //         success: (result)=>{
            
  //         },
  //         fail: ()=>{},
  //         complete: ()=>{}
  //       });
        
  //       // 构造左侧菜单数据
  //       let leftMenuList = this.cates.map(v=>v.cat_name);
  //       let rightContent = this.cates[0].children;
  //       this.setData({
  //         leftMenuList,
  //         rightContent
  //       })
  //   })
  // },
 async getCates(){
    const res = await request({url:"/categories"});
    this.cates=res;
        // 吧接口的数据存入本地
        wx.setStorage({
          key: 'cates',
          data: {time:Date.now(),data:this.cates},
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{}
        });
        
        // 构造左侧菜单数据
        let leftMenuList = this.cates.map(v=>v.cat_name);
        let rightContent = this.cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
  },
  //左侧菜单点击事件
  handleItemTap(e){
    /* 
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值就可以了
    3 根据不同的索引渲染商品内容
     */
    const {index} = e.currentTarget.dataset;
    console.log(this.currentIndex);
    let rightContent = this.cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
       //重新设置 右侧内容的scroll-view 标签距离顶部的距离
      scrollTop:0
    })
   
 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})