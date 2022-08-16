import UserRoles from 'lib/enums/userRoles.enums';
import { User } from 'lib/interfaces/models';
import userService from 'services/user.service';

interface ApplyChainsPrivacy {
  privacy: boolean;
  chains: string[];
  error?: string;
}

/**
 * apply privacy based on role.
 * currently privacy is enabled only for Admin role
 * @param user - Current logged-in user
 */
const applyPrivacyFilter = (user: User): boolean => {
  if (!user) {
    return false;
  }
  return user.role !== UserRoles.Admin;
};

const applyChainsPrivacyFilter = async (user: User, chain: string): Promise<boolean> => {
  return applyPrivacyFilter(user)
    ? (await userService.getUserAccessibleChains(String(user.organization))).includes(chain)
    : false;
};

export { applyPrivacyFilter, applyChainsPrivacyFilter };
