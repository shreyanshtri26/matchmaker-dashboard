import express from 'express';
import { getCustomers, getCustomer } from '../controllers/customerController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/customers', authenticate, getCustomers);
router.get('/customers/:id', authenticate, getCustomer);

export default router;