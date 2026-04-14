import Image from "next/image";
import { getDoctors } from "../actions/getDoctors";
import DoctorCard from "./component/DoctorCard";

export default async function Home() {
  const doctors = await getDoctors();
  return (
    <>
      <section>
        <div className="container">
          <div className="grid grid-cols-3 gap-6">
            {
              doctors.map((doctor) => <DoctorCard key={doctor._id} doctor={doctor} />)
            }
          </div>
        </div>
      </section>
    </>
  );
}
