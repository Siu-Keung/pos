'use strict';

const fixtures = require('../test/fixtures');

//返回商品:数量数组，形如：[{'123456' : 4}]
function getGoodsList(goodsIdArray) {
    //获取商品id的回调函数
    let getId = (barcodeStr) => {
        return barcodeStr.split('-')[0];
    };
    let uniqueIdList = getUniqueIdList(goodsIdArray, getId);
    //获取商品购买数量的回调函数
    let getNum = (idAndNum) => {
        let splitResult = idAndNum.split('-');
        return splitResult.length === 2 ? parseFloat(splitResult[1]) : 1;
    };
    setBuyNum(goodsIdArray, uniqueIdList, getId, getNum);
    return uniqueIdList;
}

function getUniqueIdList(goodsIdArray, getId) {
    let uniqueList = [];
    for (let barcodeStr of goodsIdArray) {
        let temp = getId(barcodeStr);
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

function setBuyNum(idArray, goodsList, getId, getNum) {
    for (let goods of goodsList) {
        let count = 0;
        for (let idAndNum of idArray) {
            if (getId(idAndNum) === goods.id)
                count += getNum(idAndNum);
        }
        goods.num = count;
    }
}

function loadGoodsDetails(goodsList, allGoodsList) {
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
}

function countDiscount(goodsDetails, discountList) {
    for (let discount of discountList) {
        //如果是买二送一活动的话
        if (discount.type === 'BUY_TWO_GET_ONE_FREE') {
            promote_buyTwoGetOneFree(goodsDetails, discount.barcodes);
        }
    }
}

function promote_buyTwoGetOneFree(goodsDetails, discountBarcodes) {
    for (let barcode of discountBarcodes) {
        if (barcode === goodsDetails.id)
            goodsDetails.payNum = goodsDetails.num - parseInt(goodsDetails.num / 3);
    }
}

function setPayNum(goodsDetailsList) {
    for (let goodsDetails of goodsDetailsList) {
        goodsDetails.payNum = goodsDetails.num;
        countDiscount(goodsDetails, fixtures.loadPromotions());
    }
    return goodsDetailsList;
}

function countPrices(goodsList) {
    let totalPrice = 0, totalDiscount = 0;
    for (let goodsItem of goodsList) {
        let subTotal = goodsItem.payNum * goodsItem.price;
        let subDiscount = goodsItem.num * goodsItem.price - subTotal;
        goodsItem.subTotal = subTotal;
        totalPrice += subTotal;
        totalDiscount += subDiscount;
    }
    let result = {total: totalPrice, discount: totalDiscount, items: goodsList};
    console.log(JSON.stringify(result));
    return result;
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

function printReceipt(tags) {
    let goodsList = getGoodsList(tags);
    loadGoodsDetails(goodsList, fixtures.loadAllItems());
    setPayNum(goodsList);
    let result = countPrices(goodsList)
    let formatStr = formatReceiptStr(result);
    console.log(formatStr);
}

module.exports = {
    getGoodsList,
    printReceipt
};


