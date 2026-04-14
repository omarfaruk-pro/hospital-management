import AppointmentBtn from "@/app/component/buttons/AppointmentBtn";
import Image from "next/image";
import Link from "next/link";

export default function DoctorCard({ doctor }) {

    return (
        <div className="bg-bg border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">


            <div className="relative overflow-hidden ">
                <Image
                    height="300"
                    width="300"
                    src={doctor.photoUrl}
                    alt={doctor.name}
                    className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-600"
                />

                <span className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                    Available
                </span>
            </div>


            <div className="p-4 text-text">

                <h2 className="text-lg font-semibold">
                    {doctor.name}
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                    {doctor.designation}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                    {doctor.experienceYears} years experience
                </p>


                <div className="mt-2 text-sm">
                    <span className="text-gray-500">Fee:</span>{" "}
                    <span className="font-semibold text-primary">
                        ৳{doctor.fee?.newPatient}
                    </span>
                </div>


                <div className="flex gap-2 mt-4">

                    <Link href={`/doctors/${doctor._id}`} className="block text-center flex-1 border border-primary text-primary hover:bg-primary hover:text-white text-sm font-medium py-2 rounded-xl transition-all">
                        Details
                    </Link>

                    <AppointmentBtn doctor={doctor} className="flex-1 bg-primary hover:bg-secondary text-white text-sm font-medium py-2 rounded-xl transition-all" />
                    {/* <button className="flex-1 bg-primary hover:bg-secondary text-white text-sm font-medium py-2 rounded-xl transition-all">
                        Appointment
                    </button> */}

                </div>

            </div>
        </div>
    );
}