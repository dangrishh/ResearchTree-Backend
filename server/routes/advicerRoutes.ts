import express, { Router } from 'express';
import { 
    registration, 
    login, 
    getSpecializations,
    getAllProposals, 
    getProposalsByUserId,
    listStudentsManage,
    updateStatusStudent,
    getAdviserStudents,
    respondToStudent
} from '../controllers/advicerControllers';

import upload from '../middleware/upload';

const router: Router = express.Router();

router.post('/register', upload.single('profileImage'), registration);
router.post('/login', login);

router.get('/specializations', getSpecializations);

router.get('/proposals', getAllProposals);
router.get('/proposals/:userId', getProposalsByUserId);


// Adviser routes
router.get('/advisor-students/:advisorId', getAdviserStudents);
router.post('/respond-student', respondToStudent);
router.get('/students-manage/:advisorId', listStudentsManage);
router.put('/update-student-status', updateStatusStudent);


export default router;
