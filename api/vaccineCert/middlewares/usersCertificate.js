import axios from 'axios';
import CertificatePrintCount from '../models/CertificatePrintCount';
import {
  badRequest,
  notFound,
  somethingWrongErr,
  success,
  tryCatchExceptions,
} from '../helpers/messages';
import { getTEIURL } from '../../commons/constants/vaccineCertURL';
import { auth } from '../../commons/utils/authConfig';

// get all tracked entity instances matching organization unit, dates,
const getTEIAttributes = async (req, res, next) => {
  try {
    // send api request to DHIS2
    const { uniqueId, phone, dataOfBirth } = req.query;
    let teiIdData;
    let attributeId;
    let attributeValue;
    if (uniqueId) {
      attributeId = 'KSr2yTdu1AI';
      attributeValue = uniqueId;
    } else {
      attributeId = 'fctSQp5nAYl';
      attributeValue = phone;
      // TODO call api that takes two or more attribute filtering
    }
    const urlTEI = getTEIURL(attributeId, attributeValue);
    const response = await axios.get(urlTEI, {
      auth,
    });
    if (!response) return null;
    const { status, data } = response;
    if (status !== 200) return somethingWrongErr(res);
    const { rows } = data;
    if (rows.length === 0) {
      const url = getTEIURL('fctSQp5nAYl', phone);
      const responsePhone = await axios.get(url, {
        auth,
      });
      if (!responsePhone) return notFound(res);
      const { status: statusPhone, data: dataPhone } = responsePhone;
      if (statusPhone !== 200) return somethingWrongErr(res);
      const { rows: rowsPhone } = dataPhone;
      if (rowsPhone.length === 0) return notFound(res);
      req.dataPhone = { teiId: rowsPhone[0][0] };
      next();
    } else {
      req.data = { teiId: rows[0][0] };
      next();
    }
  } catch (error) {
    return tryCatchExceptions(res, error);
  }
};

// moniter prints dashboards
const certificateStatus = async (req, res, next) => {
  try {
    const { uniqueId, fullName, occupation, dob, address } = req.body;
    if (!uniqueId || !fullName || !occupation || !dob || !address) { return badRequest(res); }
    // check if cert already printed else- update as reprints
    const { rows: data } = await CertificatePrintCount.getPrintCountByUser(
      uniqueId,
    );
    if (data.length !== 0) {
      const { print_count: printCount } = data[0];
      const updateData = await CertificatePrintCount.updateCertifcateCount(
        printCount + 1,
        new Date(),
        uniqueId
      );
      if (!updateData) return somethingWrongErr(res);
      return success(res);
    }
    // post data to database and track count as 0
    req.data = {
      uniqueId,
      fullName,
      occupation,
      dob,
      address,
    };
    next();
  } catch (error) {
    somethingWrongErr(res);
  }
};

export { getTEIAttributes, certificateStatus };
