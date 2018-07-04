'use strict';




// ①
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

//②
function getBuyNum(idArray, goodsList) {
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


// ③
// [{"id": "ITEM000001", "num": 5, "name": "雪碧", "unit": "瓶", "price": 3},
//   {"id": "ITEM000003", "num": 2.5, "name": "荔枝", "unit": "斤", "price": 15},
//   {"id": "ITEM000005", "num": 3, "name": "方便面", "unit": "袋", "price": 4.5}]
function getGoodsDetails(goodsList) {
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

function hasDiscount(goodsDetails){
  let discountGoodsList = loadPromotions()[0].barcodes;
  for(let discountGoodsId of discountGoodsList){
    if(discountGoodsId === goodsDetails.id){
      return true;
    }
  }
  return false;
}

// ④
// True or False
function hasDiscount(goodsDetails){
  let discountGoodsList = loadPromotions()[0].barcodes;
  for(let discountGoodsId of discountGoodsList){
    if(discountGoodsId === goodsDetails.id){
      return true;
    }
  }
  return false;
}

// ⑤
function calculatePayNum(goodsDetailsList){
  for(let goodsDetails of goodsDetailsList){
    goodsDetails.payNum = goodsDetails.num;
    if(goodsDetails.hasDiscount){
      let discountNum = 0;
      let previousNum = 0;
      for(let i = 0; i < goodsDetails.num; i++){
        if(discountNum + discountNum * 2 <= goodsDetails.num){
          previousNum = discountNum++;
        }
      }
      goodsDetails.payNum -= previousNum;
    }
  }
  return goodsDetailsList;
}

// ⑥
function countSubTotal(goodsDetailsList){
  for(let goodsDetails of goodsDetailsList){
    goodsDetails.subTotal = goodsDetails.payNum * goodsDetails.price;
  }
  return goodsDetailsList;
}

// ⑦
function countOriginalSubTotal(goodsDetailsList){
  for(let goodsDetails of goodsDetailsList){
    goodsDetails.originalSubTotal = goodsDetails.num * goodsDetails.price;
  }
  return goodsDetailsList;
}

//⑧
function countAllTotal(goodsDetailsList){
  let total = 0;
  for(let goodsDetails of goodsDetailsList){
    total += goodsDetails.subTotal;
  }
  return total;
}

//⑨
function countAllDiscount(goodsDetailsList){
  let discount = 0;
  for(let goodsDetails of goodsDetailsList){
    discount += goodsDetails.originalSubTotal - goodsDetails.subTotal;
  }
  return discount;
}


function output(receipt){
  let total = receipt.total, discount = receipt.discount, items = receipt.items;
  let str = '***<没钱赚商店>收据***';
  for(let item of items){
    let tempStr = '\n名称：' + item.name + '，数量：' + item.num + item.unit +
      '，单价：' + item.price.toFixed(2) + '(元)，小计：' + item.subTotal.toFixed(2) + '(元)';
    str += tempStr;
  }
  str += '\n----------------------';
  str += '\n总计：' + total.toFixed(2) + '(元)';
  str += '\n节省：' + discount.toFixed(2) + '(元)';
  str += '\n**********************';
  alert(str);
  console.log(str);
}


var input = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2.5',
  'ITEM000005',
  'ITEM000005-2',
];

function printReceipt() {
  var goodsList = getBuyNum(input, getGoodsIdList(input));
  goodsList = getGoodsDetails(goodsList);
  for(var goods of goodsList){
      goods.hasDiscount = false;
      if(hasDiscount(goods))
          goods.hasDiscount = true;
  };
  goodsList = calculatePayNum(goodsList);
  goodsList = countSubTotal(goodsList);
  goodsList = countOriginalSubTotal(goodsList);
  var finalResult = {};
  finalResult.items = goodsList;
  finalResult.total = countAllTotal(goodsList);
  finalResult.discount = countAllDiscount(goodsList)
  output(finalResult);
}



