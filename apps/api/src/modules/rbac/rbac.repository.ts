import { Permission, Role, type PermissionDocument, type RoleDocument } from '../../database/models.js';

export class RbacRepository {
  async listRoles() {
    const roles = await Role.find().sort({ name: 1 }).populate('permissionIds');

    return roles.map((role) => this.serializeRole(role as unknown as RoleDocument & { permissionIds: PermissionDocument[] }));
  }

  async listPermissions() {
    const permissions = await Permission.find().sort({ module: 1, action: 1 });

    return permissions.map(this.serializePermission);
  }

  async createRole(data: { name: string; slug: string; description?: string }) {
    const role = await Role.create(data);

    return this.serializeRole(role as unknown as RoleDocument & { permissionIds: PermissionDocument[] });
  }

  private serializeRole(role: RoleDocument & { permissionIds: PermissionDocument[] }) {
    return {
      id: role._id.toString(),
      name: role.name,
      slug: role.slug,
      description: role.description,
      isSystem: role.isSystem,
      permissions: (role.permissionIds ?? []).map(this.serializePermission)
    };
  }

  private serializePermission(permission: PermissionDocument) {
    return {
      id: permission._id.toString(),
      module: permission.module,
      action: permission.action,
      slug: permission.slug,
      description: permission.description
    };
  }
}
