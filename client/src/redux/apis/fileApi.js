import { apis } from "./baseApi";
import onQueryStarted from "../../utils/handleApisError";
import queryStringGenerator from "../../utils/queryStringGenerator";

const fileApi = apis.injectEndpoints({
  endpoints: (builder) => ({
    getFiles: builder.query({
      query: (filters) => queryStringGenerator("files", filters),
      onQueryStarted,
      providesTags: ["Files"],
    }),
    getSingleFile: builder.query({
      query: (id) => `files/${id}`,
      onQueryStarted,
      // providesTags: ["Files"],
    }),
    uploadFiles: builder.mutation({
      query: (data) => ({
        url: "files",
        method: "POST",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["Files"],
    }),
    updateFile: builder.mutation({
      query: ({ data, ids }) => ({
        url: `files/${ids.join(",")}`,
        method: "PUT",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["Files"],
    }),
    deleteFile: builder.mutation({
      query: ({ ids }) => ({
        url: `files/${ids.join(",")}`,
        method: "DELETE",
      }),
      onQueryStarted,
      invalidatesTags: ["Files"],
    }),
    uploadStreamVideo: builder.mutation({
      query: (data) => ({
        url: `files/upload-stream-video`,
        method: "POST",
        body: data,
      }),
      onQueryStarted,
      invalidatesTags: ["StreamVideo"],
    }),
    getStreamVideo: builder.query({
      query: (filename) =>
        queryStringGenerator("files/get-stream-video", filename),
      providesTags: ["StreamVideo"],
      onQueryStarted,
    }),
  }),
});

export const {
  useGetFilesQuery,
  useLazyGetSingleFileQuery,
  useUploadFilesMutation,
  useUpdateFileMutation,
  useDeleteFileMutation,
  useUploadStreamVideoMutation,
  useLazyGetStreamVideoQuery,
} = fileApi;
