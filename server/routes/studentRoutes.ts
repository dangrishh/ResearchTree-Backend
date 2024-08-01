import express, { Router } from 'express';
import { 
    createProposal, 
    chooseAdvisor,
    getStudentAdvisorInfo
} from '../controllers/studentControllers';

const router: Router = express.Router();

router.post('/submit-proposal', createProposal);
router.post('/choose-advisor', chooseAdvisor);
router.get('/student-advisor-info/:userId', getStudentAdvisorInfo);


export default router;