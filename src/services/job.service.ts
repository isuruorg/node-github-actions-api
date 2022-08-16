import { Job } from 'lib/interfaces/models';
import JobModel from 'models/job.model';

const findAll = async (includeSoftDelete: string): Promise<Job[]> => {
  const query = includeSoftDelete.toLowerCase() === 'true' ? {} : { status: { $ne: 'softDelete' } };
  const jobs = await JobModel.find(query)
    .populate('creator', 'username')
    .populate('labels', 'name')
    .populate('organizations', 'name');
  return jobs;
};

export { findAll };
