import { uploadReport } from "../actions/uploadCloudinary";

export const handleUpload = async (e, type) => {
  const file = e.target.files[0];

  const formData = new FormData();
  formData.append("file", file);

  const res = await uploadReport(formData, type);

  return res;
};