import type { UserProfile, UserProfileDTO } from '../types';

export function mapUserProfileDTOToDomain(dto: UserProfileDTO): UserProfile {
  return {
    uid: dto.uid,
    email: dto.email,
    role: dto.role,
    displayName: dto.displayName,
    active: dto.active ?? true,
  };
}
