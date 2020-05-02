const chai = require('chai');
const expect = chai.expect;
//const chaiHttp = require('chai-http');
//chai.use(chaiHttp);

const utilities = require('../utils/utilies');

describe('Utilities test', function() {

    it('should calculate distance between Split and Vienna', function(done){

        const splitLatitude = 43.5081; 
        const viennaLatitude = 48.2082; 

        const splitLongitude = 16.4401;
        const viennaLongitude = 16.3738;

        const expectedResult = 522.6524345327201;
        const distanceResult = utilities.calculateDistance(splitLatitude, viennaLatitude, splitLongitude, viennaLongitude);

        expect(distanceResult).to.equal(expectedResult);
        done();
    });
});