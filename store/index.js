import { create } from "zustand";

const useStore = create((set) => ({
  grade: "",
  setValue: (payload) => set({ grade: payload }),

  lessonId: "",
  setLessonId: (payload) => set({ lessonId: payload }),

  userRole: "",
  setUserRole: (payload) => set({ userRole: payload }),

  adminEmail: "",
  setAdminRole: (payload) => set({ adminEmail: payload }),

  refreshToken: "",
  setRefreshToken: (payload) => set({ refreshToken: payload }),

  proficiency_Id: "",
  setProficiencyId: (payload) => set({ proficiencyId: payload }),
}));

export default useStore;
