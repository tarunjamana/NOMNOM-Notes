import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"; 
import { collection, addDoc, getDocs, orderBy, query, Timestamp,doc,getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { WeightEntry } from "../../types/health";
import { UserProfile } from "../../types/user";

export const weightTrackerApi = createApi({
  reducerPath: "weightTrackerApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    logWeight: builder.mutation<void, { uid: string; weight: number }>({
      async queryFn({ uid, weight }) {
        try {
          await addDoc(collection(db, "users", uid, "weightLogs"), {
            weight,
            loggedAt: Timestamp.now(),
          });
          return { data: undefined };
        } catch (error) {
          return { error: error as Error };
        }
      },
    }),
    getWeightEntries: builder.query<WeightEntry[], string>({
      async queryFn(uid) {
        try {
          const q = query(
            collection(db, "users", uid, "weightLogs"),
            orderBy("loggedAt", "desc")
          );
          const snapshot = await getDocs(q);
          const data = snapshot.docs.map((doc) => doc.data() as WeightEntry);
          return { data };
        } catch (error) {
          return { error: error as Error };
        }
      },
    }),
    getUserProfile: builder.query<UserProfile, string>({
        async queryFn(uid) {
          try {
            const docRef = doc(db, "users", uid);
            const snapshot = await getDoc(docRef);
            if (!snapshot.exists()) {
                return { error: { status: 404, data: "User not found" } };
              }
    
              const data = snapshot.data() as UserProfile;
    
              return { data };
          } catch (error) {
            return { error: error as Error };
          }
        },
      }),
  }),
});


export const {
  useLogWeightMutation,
    useGetWeightEntriesQuery,
  useGetUserProfileQuery
} = weightTrackerApi;
