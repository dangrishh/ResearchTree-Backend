import express, { Router } from 'express';
import { registration, login } from '../controllers/authControllers';
import upload from '../middleware/upload';

const router: Router = express.Router();

router.post('/register', upload.single('profileImage'), registration);
router.post('/login', login);


export default router;
