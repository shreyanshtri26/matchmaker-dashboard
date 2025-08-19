import express from 'express';
import { getMatches } from '../controllers/matchController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/matches/:customerId', authenticate, getMatches);

export default router;