import { Role, User } from '../../database/models.js';

export class AuthRepository {
  findUserByEmail(email: string) {
    return User.findOne({ email }).populate({
      path: 'roleIds',
      populate: { path: 'permissionIds' }
    });
  }

  findRoleBySlug(slug: string) {
    return Role.findOne({ slug });
  }
}
