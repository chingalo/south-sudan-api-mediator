import express from 'express';
import {
  getFacilities, getVisitor, postVistor, verifyVisitor,
} from '../controllers/poeAirport';
import { checkVisitor } from '../middlewares/poeAirport';

const router = express.Router();
router.get('/facilities', getFacilities);
router.get('/checkVisitor', checkVisitor, getVisitor);
router.post('/visitor', postVistor);
router.get('/visitor', verifyVisitor);

export default { router };
