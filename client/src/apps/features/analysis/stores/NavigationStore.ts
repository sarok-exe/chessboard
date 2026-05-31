import { create } from "zustand";

export type ViewType = "game-view" | "analysis" | "puzzles" | "login" | "profile";

interface NavigationStore {
    activeView: ViewType;
    setActiveView: (view: ViewType) => void;
}

const useNavigationStore = create<NavigationStore>(set => ({
    activeView: "game-view",
    setActiveView(view) {
        set({ activeView: view });
    }
}));

export default useNavigationStore;
