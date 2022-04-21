import { toast } from "react-hot-toast";

export const BASEURL = "http://localhost:4000";
// export const BASEURL = "https://nftmintbackend.herokuapp.com";
// export const BASEURL = "https://ghospers.herokuapp.com";

export const Success = (message) => toast.success(message);
export const Error = (message) => toast.error(message);
