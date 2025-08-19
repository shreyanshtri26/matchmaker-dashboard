import { Request, Response } from 'express';
import CustomerModel from '../models/Customer';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await CustomerModel.find({ isDummy: false });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await CustomerModel.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};