import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import data from '../data/testData';

chai.use(chaiHttp);
const { expect } = chai;
const {
  uniqueId, phone, uniqueIdWrong, phoneWrong, phoneLess, phoneMore,
  teiId, teiIdWrong,
} = data;

describe('Certificate TEI SEARCH /api/v1/teis', () => {
  describe('GET /teis Unique Id Param', () => {
    const url = '/api/v1/teis';
    it('should not search TEI when both uniqueId and phone number is empty', async () => {
      const res = await chai
        .request(app)
        .get(url)
        .query({ uniqueId: '', phone: '' });
      expect(res).to.have.status(400);
    });

    it('should not  search TEI when phone number length is less than 9', async () => {
      const res = await chai.request(app).get(url).query({
        uniqueId: '',
        phone: phoneLess,
      });

      expect(res).to.have.status(400);
    });

    it('should not  search TEI when phone number length is more than 12', async () => {
      const res = await chai.request(app).get(url).query({
        uniqueId: '',
        phone: phoneMore,
      });

      expect(res).to.have.status(400);
    });

    it('should not send TEI data when phone number is wrong and Id is empty', async () => {
      const res = await chai
        .request(app)
        .get(url)
        .query({ uniqueId: '', phone: phoneWrong });
      expect(res).to.have.status(404);
    });

    it('should not  send TEI data when phone number and Unique ID is wrong', async () => {
      const res = await chai.request(app).get(url).query({
        uniqueId: uniqueIdWrong,
        phone: phoneWrong,
      });
      expect(res).to.have.status(404);
    });

    it('should send TEI data when phone number or Unique ID is valid', async () => {
      const res = await chai
        .request(app)
        .get(url)
        .query({ uniqueId, phone });

      expect(res).to.have.status(200);
    });
  });
});

describe('Verify Certificate /api/v1/teis/verify/id', () => {
  const urlValidTEI = `/api/v1/teis/verify/${teiId}`;
  const urlWrongTEI = `/api/v1/teis/verify/${teiIdWrong}`;
  it('should verify certificate when tei id is valid', async () => {
    const res = await chai.request(app).get(urlValidTEI).query();
    expect(res).to.have.status(200);
  });

  it('should not verify certificate when tei id is invalid', async () => {
    const res = await chai.request(app).get(urlWrongTEI).query();
    expect(JSON.parse(res.text)).to.have.own.property('message', 'Request failed with status code 404');
  });
});

describe('Load facilities/OU /api/v1/facilities', () => {
  const url = '/api/v1/facilities';
  it('should load all facilities asign to program', async () => {
    const res = await chai.request(app).get(url).query();
    expect(res).to.have.status(200);
  });
});

describe('URL NOT FOUND /api/v1/facilities/notfound /api/v1/teis/notfound', () => {
  const urlFacilitiesWrong = '/api/v1/facilities/notfound';
  const urlTeisWrong = '/api/v1/facilities/notfound';
  const notFound = (text, url) => {
    it(text, async () => {
      const res = await chai.request(app).get(url).query();
      expect(res).to.have.status(404);
    });
  };
  notFound('should not request api when facilities api url is wrong', urlFacilitiesWrong);
  notFound('should not request api when tei api url is wrong', urlTeisWrong);
});
