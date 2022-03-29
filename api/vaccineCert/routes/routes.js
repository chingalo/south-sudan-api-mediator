import express from 'express';
import {
  getFacilities,
  getTEIData,
} from '../controllers/usersCertificate';
import { verifyCertificate } from '../controllers/verifyCertificate';
import { CertifcateAttributesValidate } from '../middlewares/joiValidations';
import { getTEIAttributes, certificateStatus } from '../middlewares/usersCertificate';
import { getPrints, login, postPrints } from '../controllers/certificateMonitor';
import { veryfyTokens } from '../middlewares/auth';

const router = express.Router();
router.get('/facilities', getFacilities);
router.get('/teis', CertifcateAttributesValidate, getTEIAttributes, getTEIData);
router.get('/teis/verify/:teiId', verifyCertificate);
router.get('/teis/prints', veryfyTokens, getPrints);
router.post('/teis/prints', certificateStatus, postPrints);
router.post('/login', login);

export default { router };
