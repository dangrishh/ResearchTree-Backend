import express, { Router } from 'express';
import { 
    registration, 
    login, 
    getSpecializations, 
    addSpecialization, 
    updateSpecialization, 
    deleteSpecialization,
    createProposal, 
    getAllProposals, 
    getProposalsByUserId 
} from '../controllers/authControllers';

import upload from '../middleware/upload';

const router: Router = express.Router();

router.post('/register', upload.single('profileImage'), registration);
router.post('/login', login);

router.get('/specializations', getSpecializations);
router.post('/specializations', addSpecialization);
router.put('/specializations/:id', updateSpecialization);
router.delete('/specializations/:id', deleteSpecialization);


router.post('/submit-proposal', createProposal);
router.get('/proposals', getAllProposals);
router.get('/proposals/:userId', getProposalsByUserId);


export default router;
