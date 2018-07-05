'use strict';

function getGoodsIdList(goodsIdList) {
  let uniqueList = [];
  for (let goodsId of goodsIdList) {
    let temp = goodsId.split('-')[0];
    if (uniqueList.indexOf(temp) == -1) {
      uniqueList.push(temp);
    }
  }
  let resultList = [];
  uniqueList.forEach(function (item) {
    resultList.push({id: item});
  });
  return resultList;
}

function setBuyNum(idArray, goodsList) {
  for (let goods of goodsList) {
    let count = 0;
    for (let idAndNum of idArray) {
      let id = idAndNum.split('-')[0];
      let num = 1;
      if (idAndNum.split('-').length != 1)
        num = parseFloat(idAndNum.split('-')[1]);
      if (id === goods.id)
        count += num;
    }
    goods.num = count;
  }
  return goodsList;
}

function loadGoodsDetails(goodsList) {
  let allGoodsList = loadAllItems();
  for (let goods of goodsList) {
    let goodsDetails = null;
    for (let item of allGoodsList) {
      if (goods.id === item.barcode) {
        goodsDetails = item;
        break;
      }
    }
    goods.name = goodsDetails.name;
    goods.unit = goodsDetails.unit;
    goods.price = goodsDetails.price;
  }
  return goodsList;
}

function addDiscountStatus(goodsDetailsList) {
  for(let goodsDetails of goodsDetailsList){
      goodsDetails.hasDiscount = hasDiscount(goodsDetails, loadPromotions());
  }
  console.log(JSON.stringify(goodsDetailsList))
}

function hasDiscount(goodsDetails, discountList){
    for(let discount of discountList){
        //如果是买二送一活动的话
        if(discount.type === 'BUY_TWO_GET_ONE_FREE'){
            let discountIdList = discount.barcodes;
            for(let id of discountIdList){
                if(id === goodsDetails.id)
                  return true;
            }
            return false;
        }
    }
}

function setPayNum(goodsDetailsList) {
  for (let goodsDetails of goodsDetailsList) {
    goodsDetails.payNum = goodsDetails.num;
    if (goodsDetails.hasDiscount) {
      goodsDetails.payNum = goodsDetails.num - parseInt(goodsDetails.num / 3);
    }
  }
  return goodsDetailsList;
}

function formatReceiptStr(receipt) {
  let total = receipt.total, discount = receipt.discount, items = receipt.items;
  let str = '***<没钱赚商店>收据***';
  for (let item of items) {
    let tempStr = '\n名称：' + item.name + '，数量：' + item.num + item.unit +
      '，单价：' + item.price.toFixed(2) + '(元)，小计：' + item.subTotal.toFixed(2) + '(元)';
    str += tempStr;
  }
  str += '\n----------------------';
  str += '\n总计：' + total.toFixed(2) + '(元)';
  str += '\n节省：' + discount.toFixed(2) + '(元)';
  str += '\n**********************';
  return str;
}

function setPrices(goodsList){

    let totalPrice = 0, totalDiscount = 0;
    for(let goodsItem of goodsList){
        let subTotal = goodsItem.payNum * goodsItem.price;
        let subDiscount = goodsItem.num * goodsItem.price - subTotal;
        goodsItem.subTotal = subTotal;
        totalPrice += subTotal;
        totalDiscount += subDiscount;
    }
    let result = {total : totalPrice, discount : totalDiscount, items : goodsList };
    console.log(JSON.stringify(result));
    return result;
}

function printReceipt(tags) {
  let goodsList = getGoodsIdList(tags);
  setBuyNum(tags, goodsList);
  loadGoodsDetails(goodsList);
  addDiscountStatus(goodsList);
  setPayNum(goodsList);
  let finalResult = setPrices(goodsList);
  let formatStr = formatReceiptStr(finalResult);
  console.log(formatStr);
}



