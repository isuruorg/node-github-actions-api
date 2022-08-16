import { Label } from 'lib/interfaces/models';
import LabelModel from 'models/label.model';

const findAll = async (): Promise<Label[]> => {
  const labels = await LabelModel.find({})
    .populate('creator', 'username')
    .populate('lastUpdater', 'username')
    .populate('jobs');
  return labels;
};

// const createLabel = async (): Promise<Label> => {

// }

export { findAll };
