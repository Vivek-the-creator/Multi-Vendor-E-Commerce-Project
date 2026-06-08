import { RbacRepository } from './rbac.repository.js';

const rbacRepository = new RbacRepository();

export class RbacService {
  listRoles() {
    return rbacRepository.listRoles();
  }

  listPermissions() {
    return rbacRepository.listPermissions();
  }

  createRole(input: { name: string; slug: string; description?: string }) {
    return rbacRepository.createRole(input);
  }
}

export const rbacService = new RbacService();
