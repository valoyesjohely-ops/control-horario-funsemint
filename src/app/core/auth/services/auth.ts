import { Injectable, inject } from '@angular/core';

import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  authState,
  User
} from '@angular/fire/auth';

import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  query,
  where,
  DocumentData,
  DocumentSnapshot,
  serverTimestamp
} from '@angular/fire/firestore';

import { map, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  public authState$ = authState(this.auth);

  public userRole$ = this.authState$.pipe(
    switchMap(async user => {
      if (!user) {
        return null;
      }
      return await this.getUserRole(user.uid);
    })
  );

  // LOGIN EMAIL

  iniciarSesion(
    correo: string,
    password: string
  ) {

    return signInWithEmailAndPassword(
      this.auth,
      correo,
      password
    );

  }

  // REGISTRO

  async registrarse(
    correo: string,
    password: string
  ) {

    const normalizedCorreo = correo.trim().toLowerCase();
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      normalizedCorreo,
      password
    );

    const user = userCredential.user;
    const created = await this.ensureUserProfile(user, 'empleado');
    if (!created) {
      await signOut(this.auth);
      throw new Error('No se pudo crear el perfil de usuario en Firestore.');
    }

    return userCredential;
  }

  async ensureUserProfile(user: User, role = 'empleado'): Promise<boolean> {
    const userRef = doc(this.firestore, 'users', user.uid);

    try {
      const existing = await getDoc(userRef);
      if (existing.exists()) {
        return true;
      }

      await setDoc(userRef, {
        uid: user.uid,
        correo: (user.email || '').trim().toLowerCase(),
        role,
        createdAt: serverTimestamp(),
        displayName: user.displayName || ''
      });

      console.log(`Firestore profile created for uid=${user.uid}`);
      return true;
    } catch (error) {
      console.error('Error asegurando perfil de usuario en Firestore:', error);
      return false;
    }
  }

  // OBTENER DATOS COMPLETOS DEL USUARIO
  async getUserData(uid: string): Promise<any | null> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      const snap = await getDoc(userRef);
      return snap.exists() ? snap.data() : null;
    } catch (error) {
      console.error('Error obteniendo datos de usuario:', error);
      return null;
    }
  }

  // ACTUALIZAR DATOS DEL USUARIO (merge)
  async updateUserData(uid: string, data: any) {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      await setDoc(userRef, data, { merge: true });
      return true;
    } catch (error) {
      console.error('Error actualizando datos de usuario:', error);
      return false;
    }
  }

  // DOCUMENTOS DEL USUARIO (metadatos)
  async addUserDocument(uid: string, nombre: string, tipo: string) {
    try {
      const docsRef = collection(this.firestore, 'users', uid, 'documents');
      const docRef = await addDoc(docsRef, {
        nombre,
        tipo,
        fecha: new Date().toISOString(),
        estado: 'Cargado'
      });
      return { id: docRef.id };
    } catch (error) {
      console.error('Error agregando documento del usuario:', error);
      return null;
    }
  }

  async getUserDocuments(uid: string) {
    try {
      const docsRef = collection(this.firestore, 'users', uid, 'documents');
      const snap = await getDocs(docsRef);
      return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    } catch (error) {
      console.error('Error obteniendo documentos de usuario:', error);
      return [];
    }
  }

  // ACTUALIZAR ROL DE USUARIO
  async setUserRole(uid: string, role: string) {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      await setDoc(userRef, { role }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error setting user role:', error);
      return false;
    }
  }

  // OBTENER TODOS LOS USUARIOS (metadatos en Firestore 'users' collection)
  async getAllUsers() {
    try {
      const usersCol = collection(this.firestore, 'users');
      const snap = await getDocs(usersCol);
      return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    } catch (error) {
      console.error('Error obteniendo todos los usuarios:', error);
      return [];
    }
  }

  async getUsersByRole(role: string) {
    try {
      const usersCol = collection(this.firestore, 'users');
      const q = query(usersCol, where('role', '==', role));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    } catch (error) {
      console.error('Error obteniendo usuarios por rol:', error);
      return [];
    }
  }

  async hasAnyAdmin() {
    const admins = await this.getUsersByRole('admin');
    return admins.length > 0;
  }

  // Cambiar rol y registrar auditoría
  async changeUserRoleWithAudit(targetUid: string, newRole: string, changedByUid: string) {
    try {
      const userRef = doc(this.firestore, 'users', targetUid);
      const snap = await getDoc(userRef);
      const oldRole = snap.exists() ? ((snap.data() as any).role || 'empleado') : 'empleado';

      await setDoc(userRef, { role: newRole }, { merge: true });

      const auditRef = collection(this.firestore, 'audit_logs');
      await addDoc(auditRef, {
        targetUid,
        changedByUid,
        oldRole,
        newRole,
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error changing role with audit:', error);
      return false;
    }
  }

  // OBTENER ROL DEL USUARIO

  async getUserRole(uid: string): Promise<string | null> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      const docSnapshot = await getDoc(userRef);
      
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return (data as any)['role'] || 'empleado';
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo rol del usuario:', error);
      return null;
    }
  }

  // GOOGLE

  async loginGoogle() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(this.auth, provider);
    const created = await this.ensureUserProfile(userCredential.user, 'empleado');
    if (!created) {
      await signOut(this.auth);
      throw new Error('No se pudo crear el perfil de usuario en Firestore tras iniciar sesión con Google.');
    }
    return userCredential;
  }

  // LOGOUT

  cerrarSesion() {

    return signOut(this.auth);

  }

}