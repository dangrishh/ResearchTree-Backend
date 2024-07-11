import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Specialization from '../models/Specialization';
import Proposal from '../models/Proposal';
import { analyzeProposal } from '../utils/nlp';

export const registration = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const specializations = JSON.parse(req.body.specializations);
  const profileImage = (req as any).file?.filename;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage,
      specializations,
      isApproved: false,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully. Awaiting admin approval.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: 'Your account has not been approved by the admin yet.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

// Create a new proposal
export const createProposal = async (req: Request, res: Response) => {
  const { userId, proposalText } = req.body;

  if (!userId || !proposalText) {
    return res.status(400).json({ message: 'userId and proposalText are required' });
  }

  try {
    const newProposal = await Proposal.create({ userId, proposalText });
    console.log('New proposal created:', newProposal);

    const advisors = await User.find({ role: 'adviser', isApproved: true });
    console.log('Advisors fetched:', advisors);

    const topAdvisors = analyzeProposal(proposalText, advisors); // Analyze proposal to get top advisers
    console.log('Top advisors identified:', topAdvisors);

    res.status(201).json({ proposal: newProposal, topAdvisors });
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all proposals
export const getAllProposals = async (req: Request, res: Response) => {
  try {
    const proposals = await Proposal.find().populate('userId', 'name email');
    res.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get proposals by user ID
export const getProposalsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const proposals = await Proposal.find({ userId }).populate('userId', 'name email');
    res.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals by user ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getSpecializations = async (req: Request, res: Response) => {
  try {
    const specializations = await Specialization.find();
    res.status(200).json(specializations);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export const addSpecialization = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Specialization name is required' });
  }

  try {
    const newSpecialization = new Specialization({ name });
    await newSpecialization.save();
    res.status(201).json(newSpecialization);
  } catch (error) {
    console.error('Error adding specialization:', error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
};


export const updateSpecialization = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedSpecialization = await Specialization.findByIdAndUpdate(id, { name }, { new: true });
    res.status(200).json(updatedSpecialization);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export const deleteSpecialization = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Specialization.findByIdAndDelete(id);
    res.status(200).json({ message: 'Specialization deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

