// 1.发送请求获取数据
// 2.点击轮播图 预览大图
//   1)给轮播图绑定点击事件
//   2)调用小程序的api previewImage
// 3.点击加入购物车
//   1)先绑定点击事件
//   2)获取缓存中的购物车数据 数组格式
//   3)先判断 当前的商品是否已经存在于购物车
//   4)已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
//   5)不存在于购物车数组中 直接给购物车数量添加一个新元素 新元素带上购买数量属性 num 重新把购物车数组 填充回缓存中
//   6)弹出提示
import {
  request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({
  data: {
    goodsObj:{}
  },
  // 商品对象
  GoodsInfo: {},
  onLoad: function (options) {
    const{goods_id} = options;
    console.log(goods_id);
    this.getGoodsDetail(goods_id);
  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({url: "/goods/detail",data:{goods_id}});
    this.GoodsInfo = goodsObj;
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机 不识别webp图片格式
        // 最好找到后台 让她进行修改
        // 临时自己改 确保后台存在 1/webp => 1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics: goodsObj.pics
      }
    })
  },
  // 点击轮播图放大预览
  handlePrevewImage(e) {
    // 1.先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    // 2.接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    })
  },
  // 点击 加入购物车
  handleCartAdd() {
    // 1.获取缓存中的购物车 数组
    let cart = wx.getStorageSync("cart") || [];
    // 2.判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v=>v.goods_id==this.GoodsInfo.goods_id);
    if(index === -1) {
      // 3.不存在 第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    }else {
      // 4.已经存在购物车数据 执行num++
      cart[index].num++;
    }
    // 5.把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart)
    // 6.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true 方式用户手抖 疯狂点击按钮
      mask: true
    })
  }
})