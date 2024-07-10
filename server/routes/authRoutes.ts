import express, { Router } from 'express';
import { registration, login, getSpecializations, addSpecialization, updateSpecialization, deleteSpecialization } from '../controllers/authControllers';

import upload from '../middleware/upload';

const router: Router = express.Router();

router.post('/register', upload.single('profileImage'), registration);
router.post('/login', login);

router.get('/specializations', getSpecializations);
router.post('/specializations', addSpecialization);
router.put('/specializations/:id', updateSpecialization);
router.delete('/specializations/:id', deleteSpecialization);


export default router;
