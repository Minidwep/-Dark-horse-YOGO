/* 
  1 页面加载的时候
    1 从缓存中获取购物车的数据  渲染到页面中
      这些数据 checked =true
*/
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,requestPayment
} from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 2.1 获取缓存中的收获信息
    const address = wx.getStorageSync("address");
    // 3.1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(element => {
      totalPrice += element.num * element.goods_price;
      totalNum += element.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });

  },
  async handleOrderPay(){
    try {
      // 判断缓存在有没有token
    const token = wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      return;
    }
    // 3.创建订单
    // 3.1请求头参数
    const header = {Authorization:token};
    // 3.2准备实体参数
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    const cart = this.data.cart;
    let goods=[];
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }))
    const orderParams={order_price,consignee_addr,goods};
    // 4.准备发送请求 创建订单 获取订单编号
    // const {order_number} = await request({url:"/my/orders/create",method="POST",data:orderParams,header});
    let order_number = "HMDD20190809000000001061";
    // 5.发起预支付接口
    // const {pay} = await request({url:"/my/orders/req_unifiedorder",method="POST",header,data:{order_number}})
    let pay = {};
    // 6.发起微信支付
    // await requestPayment(pay);
    // 7.查询后台 订单状态
    // const res = await request({url:"/my/orders/chkOrder",method="POST",header,data:{order_number}});
    await showToast({title:"支付成功"});
    
    // 8 手挡删除缓存中 已经支付了的商品
    let newCart = wx.getStorageSync("cart");
    newCart = newCart.filter(v=>{
      return v.checked === false;
    });
    wx.setStorageSync("cart", newCart);
    wx.navigateTo({
      url: '/pages/order/index'
    });
    // console.log(res);
    } catch (error) {
      console.log(error);
      await showToast({title:"支付失败"});
    }
    
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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