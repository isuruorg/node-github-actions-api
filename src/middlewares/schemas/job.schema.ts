import Joi from "joi";
import { Status, StorageTypes } from "lib/enums/job.enum";

const jobId = Joi.string();
const jobName = Joi.string();
const organizations = Joi.string();
const images = Joi.array().items(Joi.string());
const status = Joi.string().valid(Object.values(Status).toString());
const labels = Joi.string().guid({ version: 'uuidv4' });
const storageType = Joi.string().valid(Object.values(StorageTypes).toString());
const bucket = Joi.string();
const region = Joi.string();
const accessKeyId = Joi.string();
const secretAccessKey = Joi.string();
const connectionEstablish = Joi.boolean();

const schemas = {
    createJobsSchema: Joi.object({
        organizations: organizations.required(),
        jobName: jobName.required(),
    }),
}


export default schemas;

