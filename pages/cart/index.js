/* 
1.获取用户的收货地址
  1.绑定点击事件
  2.调用小程序内置api 获取收货地址  wx.chooseAddress
  2.获取 用户对 小程序 所授予 获取地址的 权限 状态 scpoe
    1.假设 用户 点击获取收货地址的提示框 确实 那么 scpoe = true 
    
2.页面加载完毕
  1 获取本地存储中的地址
  2 吧数据 设置给data中的一个变量

3.onShow
  0.添加cart到缓存时加了checked属性
  1.获取缓存中的购物车数组
  2.吧购物车添加到data中
4.全选的显示 数据的战士
  1.onshow 获取缓存中的购物车数组
  2.根据购物车中的商品数据 所有的商品都被选中 checked=true 全选就被选中

5.总价格和总数量
  1.需要商品被选中
  2.获取购物车数组
  3.遍历
  4.判断是否被选中
  5.总价格 += 商品的单价 * 商品的数量
  6.总数量 +=  商品的数量
  7.将 总价格 和总数量 写到data中

6.商品的选中
  1.绑定change事件
  2.获取到被修改的商品对象
  3.商品对象的选中状态取反
  4.重新填装回data中和缓存中
  5.重新计算全选 总价格 总数量

7.全选和反选功能
  1.全选复选框绑定时间 change
  2.获取data中的全选变量 allChecked
  3.直接取反 
  4.遍历购物车数组 让里面的购物车商品 状态跟随 allChecked 改变而改变
  5.吧购物车数组 和 allChecked 重新设置会data 吧购物车重新设置到缓存中

8 商品数量的编辑
  1."+" "-" 按钮 绑定同一个事件 区分的关键是 自定义属性
    1."+" "+1"
    2."-" "-1"
  2.传递被点击的商品id goods_id
  3.获取data中的购物车数组 来获取需要被修改的商品对象
  4.直接修改商品对象的数量 num
  5.吧cart 重新设置回data 和 缓存中
9 判断有没有地址信息
  1.判断有没有收获地址
  2.判断用户有没有商品
  3.经过以上验证 跳转到支付页面
*/
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({


  async handleChooseAddress() {
    try {
      // 1 获取权限状态
      const res1 = await getSetting();
      const scpoeAddress = res1.authSetting["scope.address"];
      // 2 判断权限状态
      if (scpoeAddress === true || scpoeAddress === undefined) {
        // 调用获取收货地址的代码 API
        let address = await chooseAddress();
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
        wx.setStorageSync("address", address);
      } else {
        // 3 打开设置
        await openSetting();
        // 调用获取收货地址的代码 API
        let address = await chooseAddress();
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
        wx.setStorageSync("address", address);
      }


    } catch (error) {
      console.log(error);
    }
  },




  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
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
    const cart = wx.getStorageSync("cart") || [];
    this.setData({
      address
    });
    this.setCart(cart);
  },
  // 商品选中
  handleItemChange(e) {
    // 1 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // console.log(goods_id);
    // 2 获取购物车信息
    let cart = this.data.cart;
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;
    // 5 6 吧购物车数据重新设置回data和缓存中
    this.setCart(cart);

  },
  // 设置购物车的状态 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {

    let totalNum = 0;
    let totalPrice = 0;
    let allChecked = true;
    cart.forEach(element => {
      if (element.checked) {
        totalPrice += element.num * element.goods_price;
        totalNum += element.num;
      } else {
        allChecked = false;
      }
    });
    //判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalNum,
      totalPrice,
      allChecked
    });
    wx.setStorageSync("cart", cart);
  },
  handleItemAllCheck() {
    let {
      cart,
      allChecked
    } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },
  // 商品数量编辑功能
  async handleItemNumEdit(e) {
    // 1.获取传递过来的参数
    const {
      operation,
      id
    } = e.currentTarget.dataset;

    let {
      cart
    } = this.data;

    const index = cart.findIndex(v => v.goods_id === id);

    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({
        content: '您是否要删除该物品'
      })
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }

    } else {
      cart[index].num += operation;
      this.setCart(cart);
    }

  },
  // 点击结算功能
  async handlePay(){
    // 1 判断收货地址
    const {address,totalNum} = this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return ;
    }
    if(totalNum===0){
      await showToast({title:"您还没有选择商品"});
      return;
    }

    wx.navigateTo({
      url: '/pages/pay/index'
    });
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
  // handleChooseAddress(){
  //   // 1 获取权限状态
  //   wx.getSetting({
  //     success: (result)=>{
  //     //  2获取权限状态 只要发现一些属性名很怪异 都要使用 []形式来获取属性值
  //       const scpoeAddress = result.authSetting["scope.address"];
  //       if(scpoeAddress === true || scpoeAddress === undefined){
  //         wx.chooseAddress({
  //           success: (result1)=>{
  //             console.log(result1); 
  //           }
  //         });
  //       } else {
  //         // 3.用戶以前拒絕過授予权限 先诱导用户打开权限
  //         wx.openSetting({
  //           success: (result2)=>{
  //             // 4. 可以调用收获地址代码
  //             wx.chooseAddress({
  //               success: (result3)=>{
  //                 console.log(result3); 
  //               }
  //             });
  //           }
  //         });
  //       }
  //     },
  //     fail: ()=>{},
  //     complete: ()=>{}
  //   });    


  // },
})