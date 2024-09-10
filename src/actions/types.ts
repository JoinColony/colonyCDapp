import { type ColonyRole } from '@colony/colony-js';

export type SingleRole = ColonyRole;
export type RoleGroup = ColonyRole[];
export type RoleGroupSet = ColonyRole[][];

export type RequiredColonyRoleGroup = SingleRole | RoleGroup | RoleGroupSet;
