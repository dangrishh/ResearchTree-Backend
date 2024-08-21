import mongoose, { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'adviser';
  profileImage: string;
  specializations: string[];
  isApproved: boolean;
  chosenAdvisor: Schema.Types.ObjectId | null;
  advisorStatus: 'accepted' | 'declined' | 'pending' | null;
  declinedAdvisors: Schema.Types.ObjectId[];
  panelists: Schema.Types.ObjectId[];
}

const userSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'adviser'] },
  profileImage: { type: String, required: false },
  specializations: { type: [String], required: function() { return this.role === 'adviser'; } },
  isApproved: { type: Boolean, default: false },
  chosenAdvisor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  advisorStatus: { type: String, enum: ['accepted', 'declined', 'pending', null] },
  declinedAdvisors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  panelists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const User = model<IUser>('User', userSchema);

export default User;