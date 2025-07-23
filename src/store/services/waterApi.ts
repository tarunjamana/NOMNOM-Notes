import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { getWaterLog, updateWaterLog } from '../../helpers/firebase/services/water';
import { format } from 'date-fns';
import { WaterLog } from '../../types/health';


const today = () => format(new Date(), "yyyy-MM-dd");

export const waterApi = createApi({
  reducerPath: 'waterApi',
  baseQuery: fakeBaseQuery(), 
  tagTypes: ['WaterLog'],
  endpoints: (builder) => ({
    getWaterLog: builder.query<WaterLog | null, string>({
      queryFn: async (uid) => {
        try {
          const data = await getWaterLog(uid, today());
          return { data };
        } catch (error: unknown) {
            if (error instanceof Error) {
              return { error: { status: 'CUSTOM_ERROR', error: error.message } };
            }
            return { error: { status: 'CUSTOM_ERROR', error: 'Unknown error' } };
          }
      },
      providesTags: ['WaterLog'],
    }),
    addWaterIntake: builder.mutation<WaterLog, { uid: string; amount: number }>({
      queryFn: async ({ uid, amount }) => {
        try {
          const updated = await updateWaterLog(uid, today(), amount);
          return { data: updated };
        } catch (error: unknown) {
            if (error instanceof Error) {
              return { error: { status: 'CUSTOM_ERROR', error: error.message } };
            }
            return { error: { status: 'CUSTOM_ERROR', error: 'Unknown error' } };
          }
      },
      invalidatesTags: ['WaterLog'], // refetch the water log after update
    }),
  }),
});

export const { useGetWaterLogQuery, useAddWaterIntakeMutation } = waterApi;