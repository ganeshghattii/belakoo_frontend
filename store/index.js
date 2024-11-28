import { create } from "zustand";

const useStore = create((set) => ({
  grade: "",
  setValue: (payload) => set({ grade: payload }),

  lessonId: "",
  setLessonId: (payload) => set({ lessonId: payload }),

  userRole: "",
  setUserRole: (payload) => set({ userRole: payload }),
}));

export default useStore;
``;
