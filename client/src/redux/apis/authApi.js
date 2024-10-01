import { apis } from "./baseApi";
import onQueryStarted from "../../utils/handleApisError";

const authApi = apis.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: "auth/me",
      }),
      onQueryStarted,
      providesTags: ["Auth"],
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: "auth/signup",
        method: "POST",
        body: data,
      }),
      onQueryStarted,
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "auth/login",
        method: "POST",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["Auth", "Files"],
    }),
    logout: builder.query({
      query: () => ({
        url: "auth/logout",
        onQueryStarted,
      }),
    }),
    twoFactorAuth: builder.mutation({
      query: (data) => ({
        url: "auth/two-factor-auth",
        method: "POST",
        body: data,
      }),
      onQueryStarted,
    }),
    verifyTwoFactorAuth: builder.mutation({
      query: (data) => ({
        url: "auth/verify-two-factor-auth",
        method: "POST",
        body: data,
      }),
      onQueryStarted,
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useSignupMutation,
  useLoginMutation,
  useLazyLogoutQuery,
  useTwoFactorAuthMutation,
  useVerifyTwoFactorAuthMutation,
} = authApi;
