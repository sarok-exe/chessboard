import { create } from "zustand";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

interface AuthState {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    initialized: boolean;
    init: () => () => void;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    checkAdmin: (u: User) => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAdmin: false,
    loading: true,
    initialized: false,

    init: () => {
        if (get().initialized) return () => {};
        set({ initialized: true });

        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            set({ user: u, loading: true });
            if (u) {
                try {
                    const adminDoc = await getDoc(doc(db, "admins", u.email || ""));
                    set({ isAdmin: adminDoc.exists() });
                } catch {
                    set({ isAdmin: false });
                }
            } else {
                set({ isAdmin: false });
            }
            set({ loading: false });
        });

        return unsubscribe;
    },

    login: async () => {
        await signInWithPopup(auth, googleProvider);
    },

    logout: async () => {
        await signOut(auth);
    },

    checkAdmin: async (u: User) => {
        try {
            const adminDoc = await getDoc(doc(db, "admins", u.email || ""));
            set({ isAdmin: adminDoc.exists() });
        } catch {
            set({ isAdmin: false });
        }
    }
}));

export default useAuthStore;
