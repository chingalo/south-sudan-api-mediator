import { badRequest, notFound, success, tryCatchExceptions } from '../helpers/poeMessages';
import http from '../../commons/utils/httpServices';
import { auth } from '../../commons/utils/authConfig';
import { searchEventURL } from '../../commons/constants/poeAirport';

// check if user visted south sudan before
const checkVisitor = async (req, res, next) => {
  try {
    const { passPortNumber, nationality } = req.query;
    if (!passPortNumber || !nationality) return badRequest(res);
    // TODO filter rows fields in the DHIS2 api field filter
    const url = searchEventURL(passPortNumber, nationality);
    const results = await http.get(url, {
      auth,
    });
    if (results && results.data.rows.length === 0) return success(res, []);
    const visitorHistoryId = results.data.rows[0][0];
    req.data = { visitorHistoryId };
    next();
  } catch (error) {
    tryCatchExceptions(res, error);
  }
};

export { checkVisitor };
