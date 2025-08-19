import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addNote,
} from '../controllers/customerController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, getCustomers);
router.post('/', auth, createCustomer);
router.get('/:id', auth, getCustomerById);
router.put('/:id', auth, updateCustomer);
router.delete('/:id', auth, deleteCustomer);
router.post('/:id/notes', auth, addNote);

export default router;
