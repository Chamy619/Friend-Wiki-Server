import mongoose, { Schema } from 'mongoose';

const GenealogySchema = new Schema({
  name: String,
  date: String,
  description: String,
});

const Genealogy = mongoose.model('Genealogy', GenealogySchema);
export default Genealogy;
