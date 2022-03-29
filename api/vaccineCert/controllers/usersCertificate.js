/* eslint-disable max-len */
import axios from 'axios';
import { success, notFound } from '../helpers/messages';
import { auth } from '../../commons/utils/authConfig';
import { getFacilitiesURL } from '../../commons/constants/vaccineCertURL';
import { teiEnrollments } from '../helpers/getTEIData';
import asyncMiddleware from '../middlewares/asyncCalls';

// get all organization units from dhis2
const getFacilities = asyncMiddleware(async (req, res) => {
  const url = getFacilitiesURL();
  const response = await axios.get(url, {
    auth,
  });
  if (!response) return notFound(res);
  const { status, data } = response;
  if (status !== 200) return notFound(res);
  const { organisationUnits } = data;
  return success(res, organisationUnits);
});

// get tei events return from middleware
const getTEIData = asyncMiddleware(async (req, res) => {
  const teiIdUnique = req.data;
  const teiIdPhone = req.dataPhone;
  if (teiIdUnique) return teiEnrollments(teiIdUnique.teiId, res);
  return teiEnrollments(teiIdPhone.teiId, res);
});

export { getFacilities, getTEIData }; // named exports
