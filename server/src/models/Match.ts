import { Schema, model, Document } from 'mongoose';

export interface IMatch extends Document {
  customer: Schema.Types.ObjectId;
  profile: Schema.Types.ObjectId;
  score: number;
  explanation: string;
}

const MatchSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  profile: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  score: { type: Number, required: true },
  explanation: { type: String, required: true },
});

export default model<IMatch>('Match', MatchSchema);
