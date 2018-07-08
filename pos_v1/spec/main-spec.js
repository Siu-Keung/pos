const main = require('../main/main');

//模板：
// describe('main()', () => {
//
//     it('should calculate the remaindar', () => {
//         expect(main.caclRemaindar(9, 3)).toBe(0);
//         expect(main.caclRemaindar(11, 4)).toBe(3);
//     });
//
// });

describe('getGoodsList', () => {

    it('should print text', () => {
        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ];


        const expectText = '[{"id":"ITEM000001","num":5},{"id":"ITEM000003","num":2.5},{"id":"ITEM000005","num":3}]';

        spyOn(console, 'log');
        console.log(JSON.stringify(main.getGoodsList(tags)));
        expect(console.log).toHaveBeenCalledWith(expectText);

    });

});


describe('printReceipt()', () => {

    it('should print text', () => {
        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ];

        const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

        spyOn(console, 'log');
        main.printReceipt(tags);
        expect(console.log).toHaveBeenCalledWith(expectText);

    });

});

