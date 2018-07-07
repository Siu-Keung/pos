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

describe('main()', () => {

    it('should calculate the remaindar', () => {
        expect(main.getGoodsIdList(['1', '2', '3']).length).toBe(3);
    });

});

