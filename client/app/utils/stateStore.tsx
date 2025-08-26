import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
//import Notifications from '~/routes/admin/notifications';
// export const useUserStore = create((set) => ({
//   user: {},
//   updateUser: (newUser:Object) => set({ user: newUser }),
// }))

type Notification = {
  _id: string,
  title: string;

  content: string;

  to: string;

  from: {
    id: string;
    avatar: string;
  };
};
type Payload = {
  notifString: string
}
type userStore = {
  user: object
  updateUser: (user:object) => void
  notifications: Notification[],
  updateNotifications: (notifs: Notification[]) => void
}
export const useUserStore = create<userStore>()(persist(
  (set) => ({
    user : {},
    notifications: [],
    updateUser : (newUser:Object) => set({ user: newUser }),
    updateNotifications: (newNotifications:Notification[]) => set({notifications: newNotifications})
  }),
  {
    name: 'user-storage', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  },
))

  
