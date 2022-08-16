import bcrypt from 'bcryptjs';

import { generateJwt } from 'lib/utils/jwt.utils';
import { User } from 'lib/interfaces/models';
import OrganizationModel from 'models/organization.model';
import UserModel from 'models/user.model';
import UserRoles from 'lib/enums/userRoles.enums';
import serviceHandler from 'middlewares/handlers/serviceResponseHandler';

interface CreateUser {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  activeTill?: string;
  active?: boolean;
  password: string;
  passwordHash?: string;
}

interface valiatedUser {
  name: string;
  role: string;
  email: string;
  active: boolean;
  token: string;
}

const SELECT_FEILDS = 'name email role active _id phone createAt';
const DEFAULT_PASSWORD = 'traceclaw@2022';
/**
 * return without password
 * @param user
 * @returns
 */
const createUser = async (user: CreateUser): Promise<User | string> => {
  const isExistingUser = await UserModel.findOne({ email: user.email });
  if (!isExistingUser) {
    user.passwordHash = bcrypt.hashSync(user.password, 10);
    const newUser = await new UserModel(user).save();
    // const { passwordHash, ...userWithoutPassword } = newUser;
    return newUser;
  } else {
    return 'Existing user for the given email';
  }
};

/**
 * return without password
 * generate jwt token and attach it to user object
 * @param email
 * @param password
 * @returns
 */
const validatePassword = async (
  email: string,
  password: string,
): Promise<valiatedUser | String> => {
  const user = await UserModel.findOne({ email: email });
  if (user) {
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (isValidPassword) {
      const jwtToken = generateJwt(user.id, user.role);
      return {
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        token: jwtToken,
      };
    } else {
      return 'Invalid Password';
    }
  } else {
    return 'No user found for the given email';
  }
};

/**
 * return without password
 * @param role
 * @returns
 */
const getAllUsers = async (role: string = ''): Promise<User[] | String> => {
  const roles: string[] = Object.values(UserRoles);
  const filter = roles.includes(role) ? { role: role } : {};
  return await UserModel.find(filter, SELECT_FEILDS).populate('organization', 'name');
};

const getUserFromToken = async (token: { id: string; role: string }): Promise<User | string> => {
  try {
    const { id } = token;
    return await UserModel.findById(id);
  } catch (error) {
    return `error: ${error.message}`;
  }
};

const getUserAccessibleChains = async (organizationId: string) => {
  const org = await OrganizationModel.findById(organizationId).select('accessibleChains');
  return org?.accessibleChains || [];
};

const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId, SELECT_FEILDS).populate('organization', 'name');
  return user;
};

const editUserById = async user => {
  const id = user.id;
  delete user.id;

  if (user.password) {
    user.passwordHash = bcrypt.hashSync(user.password, 10);
  }

  const updatedUser = await UserModel.findByIdAndUpdate(id, user, { new: true });
  return updatedUser;
};

const getActiveOrInactiveUserCount = async (active: boolean = true) => {
  try {
    const count = await UserModel.find({ active: active }).count();
    return serviceHandler(count, null);
  } catch (error) {
    return serviceHandler(null, error);
  }
};

const resetPassword = async (id: string, currentPassword: string, newPassword: string) => {
  try {
    const user: User = await UserModel.findById(id);
    if (user) {
      if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
        return serviceHandler(false, 'Make sure current password is correct!');
      }

      const updatedUser = await UserModel.findByIdAndUpdate(id, {
        passwordHash: bcrypt.hashSync(newPassword, 10),
      });
      if (updatedUser) return serviceHandler(true, null);
      return serviceHandler(false, 'Password update failed due to a internal server error');
    }
    return serviceHandler(false, 'User not found to update password');
  } catch (error) {
    return serviceHandler(false, error);
  }
};

const resetToDefaultPassword = async (id: string) => {
  try {
    const user: User = await UserModel.findById(id);
    if (user) {
      const updatedUser = await UserModel.findByIdAndUpdate(id, {
        passwordHash: bcrypt.hashSync(DEFAULT_PASSWORD, 10),
      });
      if (updatedUser) return serviceHandler(true, null);
      return serviceHandler(false, 'Password update failed due to a internal server error');
    }
    return serviceHandler(false, 'User not found to update password');
  } catch (error) {
    return serviceHandler(false, error);
  }
};

export = {
  createUser,
  validatePassword,
  getAllUsers,
  getUserFromToken,
  getUserAccessibleChains,
  getUserById,
  editUserById,
  getActiveOrInactiveUserCount,
  resetPassword,
  resetToDefaultPassword,
};
