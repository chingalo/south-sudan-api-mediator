import asyncMiddleware from '../middlewares/asyncCalls';
import { teiEnrollments } from '../helpers/getTEIData';

const verifyCertificate = asyncMiddleware(async (req, res) => {
  const { teiId } = req.params;
  teiEnrollments(teiId, res);
});

export { verifyCertificate };
