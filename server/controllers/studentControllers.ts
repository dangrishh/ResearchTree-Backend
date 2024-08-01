import { Request, Response } from 'express';
import User from '../models/User';
import Proposal from '../models/Proposal';
import { analyzeProposal } from '../utils/nlp';
import { ObjectId } from 'mongoose';

// Dummy function to fetch top advisors
const getTopAdvisors = async () => {
  return await User.find({ role: 'adviser', isApproved: true }).limit(5);
};
export const createProposal = async (req: Request, res: Response) => {
  const { userId, proposalText } = req.body;

  if (!userId || !proposalText) {
    return res.status(400).json({ message: 'userId and proposalText are required' });
  }

  try {
    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.advisorStatus === 'accepted') {
      return res.status(400).json({ message: 'Cannot submit proposal after advisor acceptance' });
    }

    const declinedAdvisors = student.declinedAdvisors || [];
    const advisors = await User.find({
      role: 'adviser',
      isApproved: true,
      _id: { $nin: declinedAdvisors }
    });

    const topAdvisors = await analyzeProposal(proposalText, advisors);

    const newProposal = await Proposal.create({ userId, proposalText });
    res.status(201).json({ proposal: newProposal, topAdvisors });
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const chooseAdvisor = async (req: Request, res: Response) => {
  const { userId, advisorId } = req.body;

  if (!userId || !advisorId) {
    return res.status(400).json({ message: 'userId and advisorId are required' });
  }

  try {
    const student = await User.findById(userId);
    if (student?.chosenAdvisor && student.advisorStatus !== 'declined') {
      return res.status(400).json({ message: 'Advisor already chosen' });
    }

    const topAdvisors = await getTopAdvisors();
    const panelists = topAdvisors.filter(advisor => (advisor._id as string).toString() !== advisorId).slice(0, 3);

    if (student) {
      student.chosenAdvisor = advisorId;
      student.advisorStatus = 'pending';
      student.panelists = panelists.map(panelist => panelist._id as ObjectId);
      await student.save();
    }

    res.status(200).json({ message: 'Advisor chosen and panelists assigned successfully', student });
  } catch (error) {
    console.error('Error choosing advisor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getStudentAdvisorInfo = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const student = await User.findById(userId).populate('chosenAdvisor').populate('panelists');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ chosenAdvisor: student.chosenAdvisor, advisorStatus: student.advisorStatus, panelists: student.panelists });
  } catch (error) {
    console.error('Error fetching student advisor info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};