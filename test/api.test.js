const chai = require("chai");
const expect = chai.expect;
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);

describe("API endpoint test", function () {
  describe("test GET /api/countries", () => {
    it("it should get all the countries", (done) => {
      chai
        .request(server)
        .get("/api/countries")
        .end((err, res) => {
          res.should.have.status(200);

          const responseData = res.body;
          responseData.should.be.a("object");
          responseData.should.have.own.property("countries");

          const responseCountries = responseData.countries;
          responseCountries.should.be.a("array");
          responseCountries[0].should.be.a("object");
          responseCountries[0].should.have.own.property("lat");
          responseCountries[0].should.have.own.property("lng");
          responseCountries[0].should.have.own.property("name");

          done();
        });
    });

    it("it should get only countries which include 'aus'", (done) => {
      const searchTerm = "Aus";
      chai
        .request(server)
        .get(`/api/countries?searchTerm=${searchTerm}`)
        .end((err, res) => {
          res.should.have.status(200);

          const responseData = res.body;
          responseData.should.be.a("object");
          responseData.should.have.own.property("countries");

          const responseCountries = responseData.countries;
          responseCountries.should.be.a("array");
          responseCountries[0].should.be.a("object");
          responseCountries[0].should.have.own.property("lat");
          responseCountries[0].should.have.own.property("lng");
          responseCountries[0].should.have.own.property("name");

          for (let i = 0; i < responseCountries.length; i++) {
            expect(
              responseCountries[i].name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ).to.be.true;
          }

          done();
        });
    });
  });

});
