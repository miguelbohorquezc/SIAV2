import { db } from '@/infrastructure/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import type { UserProfile, UserProfileDTO } from '../types';
import type { Role } from '@/shared/constants/auth';
import { mapUserProfileDTOToDomain } from './mappers';
import { AuthFeatureError } from '../types';

/** Lee el perfil del usuario desde users/{uid} */
export async function getUserProfile(uid: string): Promise<UserProfile> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new AuthFeatureError('Perfil no configurado para este usuario', 'profile/not-found');
  }
  const data = snap.data() as UserProfileDTO;
  if (!data.role) {
    throw new AuthFeatureError('Rol no asignado en el perfil', 'profile/missing-role');
  }
  return mapUserProfileDTOToDomain(data);
}

/** Crea el perfil inicial del usuario (rol por defecto DOCENTE) */
export async function createUserProfile(
  uid: string,
  email: string,
  role: Role = 'DOCENTE',
  displayName?: string
): Promise<void> {
  const ref = doc(db, 'users', uid);
  const dto: UserProfileDTO = {
    uid,
    email,
    role,
    displayName,
    active: true,
  };
  await setDoc(ref, dto, { merge: false });
}
