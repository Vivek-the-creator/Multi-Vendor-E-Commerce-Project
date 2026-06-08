import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { User, type PermissionDocument, type RoleDocument } from '../../database/models.js';
import { AppError } from '../../shared/errors/app-error.js';
import { AuthRepository } from './auth.repository.js';
import type { LoginInput, RegisterInput } from './auth.validators.js';

const authRepository = new AuthRepository();
const accessTokenOptions: SignOptions = {
  expiresIn: env.ACCESS_TOKEN_TTL as NonNullable<SignOptions['expiresIn']>
};

type PopulatedRole = RoleDocument & { permissionIds: PermissionDocument[] };
type CreatedUser = { createdAt: Date };

export class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await authRepository.findUserByEmail(input.email);
    if (existingUser) {
      throw new AppError(409, 'EMAIL_ALREADY_REGISTERED', 'A user with this email already exists.');
    }

    const role = await authRepository.findRoleBySlug(input.role);
    if (!role) {
      throw new AppError(500, 'DEFAULT_ROLE_MISSING', `Default role '${input.role}' is not seeded.`);
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await User.create({
      name: input.name,
      email: input.email,
      passwordHash,
      roleIds: [role._id]
    });

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      status: user.status,
      createdAt: (user as unknown as CreatedUser).createdAt
    };
  }

  async login(input: LoginInput) {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    const populatedRoles = user.roleIds as unknown as PopulatedRole[];
    const roles = populatedRoles.map((role) => role.slug);
    const permissions = populatedRoles.flatMap((role) =>
      (role.permissionIds as PermissionDocument[]).map((permission) => permission.slug)
    );

    const payload = {
      id: user._id.toString(),
      email: user.email,
      roles,
      permissions: Array.from(new Set(permissions))
    };

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, accessTokenOptions);

    const refreshToken = jwt.sign({ id: user.id, tokenVersion: user.tokenVersion }, env.JWT_REFRESH_SECRET, {
      expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        roles,
        permissions: payload.permissions
      },
      accessToken,
      refreshToken
    };
  }
}

export const authService = new AuthService();
