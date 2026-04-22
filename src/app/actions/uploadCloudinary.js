"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

export async function uploadReport(formData) {
    const file = formData.get("file");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    resource_type: "raw",
                    format: "pdf",
                    public_id: `report_${Date.now()}.pdf`,
                    folder: "reports",
                },
                (error, result) => {
                    if (error) reject(error);

                    resolve({
                        success: true,
                        url: result.secure_url,
                    });
                }
            )
            .end(buffer);
    });
}