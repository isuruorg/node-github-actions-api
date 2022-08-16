import { User } from 'lib/interfaces/models';
import { Organization } from 'lib/interfaces/organization.interface';
import { Organization as OrgModelInterface } from 'lib/interfaces/models';
import OrganizationModel from 'models/organization.model';
import serviceHandler from 'middlewares/handlers/serviceResponseHandler';
// import UserModel from 'models/user.model';

const createOrg = async (organization: Organization, user: User) => {
  organization.creator = user.id;
  const org = new OrganizationModel(organization);
  return await org.save();
};

/**
 * only chains can be updated here, to remove the chains use seperate removeChains method
 * @param organization
 * @param user
 * @returns
 */
const updateOrgById = async (organization: Organization, user: User) => {
  let accessibleChains: string[] | [] = [];
  organization['editor'] = user.id;
  return await OrganizationModel.findByIdAndUpdate(organization.id, organization, { new: true });
};

const getAllOrgs = async (): Promise<OrgModelInterface[]> => {
  return await OrganizationModel.find({});
};

const getAllOrgsCounts = async () => {
  try {
    const count = await OrganizationModel.find({}).count();
    return serviceHandler(count, null);
  } catch (error) {
    return serviceHandler(null, error);
  }
};

const removeChains = async (
  id: string,
  chainsToRemove: string[],
  user: User,
): Promise<OrgModelInterface> => {
  return await OrganizationModel.findByIdAndUpdate(
    id,
    { $pullAll: { accessibleChains: chainsToRemove }, editor: user.id },
    { new: true },
  );
};

const getOrgById = async (id: string) => {
  try {
    return serviceHandler(await OrganizationModel.findById(id), null);
  } catch (error) {
    return serviceHandler(null, error);
  }
};

export = {
  createOrg,
  updateOrgById,
  getAllOrgs,
  removeChains,
  getAllOrgsCounts,
  getOrgById,
};
