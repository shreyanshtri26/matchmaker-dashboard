import { Router } from 'express';
import { getSuggestions } from '../controllers/matchController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/suggestions/:id', auth, getSuggestions);

export default router;
