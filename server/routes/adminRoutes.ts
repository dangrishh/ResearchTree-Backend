import express, { Router } from 'express';
import { registerAdmin, loginAdmin, getPendingUsers, approveUser, declineUser, getAllUsers, deleteUser } from '../controllers/adminController';
import upload from '../middleware/upload';

const router: Router = express.Router();

router.post('/register', upload.single('profileImage'), registerAdmin);
router.post('/login', loginAdmin);
router.put('/approve/:userId', approveUser);
router.put('/decline/:userId', declineUser);
router.get('/pending', getPendingUsers);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);


export default router;
