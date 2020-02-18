// pages/goods_list/index.js
import {
  request
} from "../../request/index";

import regeneratorRuntime from '../../lib/runtime/runtime';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]

  },
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalPages: 1
  ,
  // 标题点击事件 从子组件传递
  handleTabsItemChange(e){
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.QueryParams.cid = options.cid;
      this.getGoodsList();


  },
    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 判断是否还有下一页
    if(this.QueryParams.pagenum >= this.totalPages){
      //没有下一页数据
      wx.showToast({
        title: '没有下一页了'
      });
      
    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
      
    }
    
  },

  // 获取商品列表数据
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.QueryParams});
    const total = res.total;
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      //拼接数组
      goodsList:[...this.data.goodsList,...res.goods]
    })
    wx.stopPullDownRefresh();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 重置数组
    this.setData({
      goodsList:[]
    })
    // 重置页码
    this.QueryParams.pagenum = 1;
    this.getGoodsList();
   
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})