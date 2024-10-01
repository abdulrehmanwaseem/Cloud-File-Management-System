import { toast } from "react-toastify";
import { setUnAuthenticated } from "../redux/slice/auth";

const onQueryStarted = async (args, { queryFulfilled, dispatch }) => {
  try {
    await queryFulfilled;
  } catch ({ error }) {
    const { status, data } = error;
    if (status === 400) {
      toast.error(data?.message);
    } else if (status === 401) {
      dispatch(setUnAuthenticated());
    } else if (status === 404) {
      toast.error("Resource not found");
    } else if (status === 500) {
      toast.error(data?.message || "Internal Server Error");
    } else {
      toast.error("Something went wrong");
    }
  }
};

export default onQueryStarted;
