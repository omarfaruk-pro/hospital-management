
import { 
  MdSchool, 
  MdWork, 
  MdPayments, 
  MdAccessTime, 
  MdPhoneInTalk, 
  MdVerifiedUser,
  MdLabel,
  MdInfo,
  MdStar
} from 'react-icons/md';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { getDoctorById } from '@/app/actions/getDoctors';
import Image from 'next/image';
import AppointmentBtn from '@/app/component/buttons/AppointmentBtn';

export default async function DoctorDetailsPage({params}) {
  const {id} =await params;
 
  const doctor = await getDoctorById(id);


  const reviews = [
    {
      _id: 'rev1',
      patientName: 'Rahim Ali',
      rating: 5,
      comment: 'Excellent doctor! Dr. Arif listens very carefully and explains everything in detail. Highly recommended.',
      date: '2026-03-25T10:00:00.000Z'
    },
    {
      _id: 'rev2',
      patientName: 'Fatima Begum',
      rating: 4,
      comment: 'Very professional. The treatment was effective, and the staff was courteous. Slightly long waiting time.',
      date: '2026-03-20T11:30:00.000Z'
    },
    {
      _id: 'rev3',
      patientName: 'Kamil Ahmed',
      rating: 5,
      comment: 'Saved my life! Very quick diagnosis and excellent care after that. Forever grateful to Dr. Arif.',
      date: '2026-03-15T09:15:00.000Z'
    }
  ];

  const averageRating = (reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="bg-bg py-10 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="w-full lg:w-1/3 max-w-[320px] mx-auto lg:mx-0">
              <div className="aspect-square relative rounded-2xl overflow-hidden border-4 border-primary/10">
                <Image
                  width="400"
                  height="400" 
                  src={doctor.photoUrl} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {doctor.departments.map((dept) => (
                    <span key={dept._id} className="flex items-center gap-1 bg-primary/5 text-secondary px-3 py-1 rounded-md text-xs font-bold uppercase">
                      <MdLabel /> {dept.name}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl font-extrabold text-text mb-2">{doctor.name}</h1>
                <p className="text-xl font-medium text-secondary flex items-center gap-2">
                  <MdVerifiedUser className="text-primary" />
                  {doctor.designation}
                </p>
                <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">ID: {doctor._id}</p>
              </div>

              {/* Bio Section */}
              <div className="p-5 bg-bg/50 rounded-2xl border border-gray-100">
                <h3 className="flex items-center gap-2 text-sm font-bold text-text mb-2 uppercase">
                  <MdInfo className="text-primary" /> About Doctor
                </h3>
                <p className="text-gray-600 leading-relaxed italic">
                  &quot;{doctor.bio}&quot;
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-bg">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <MdWork className="text-primary text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-bold text-text">{doctor.experienceYears} Years+</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-bg">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <MdPhoneInTalk className="text-primary text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Assistant Contact</p>
                    <p className="font-bold text-text">{doctor.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
  
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-text mb-8 flex items-center gap-3">
                <MdSchool className="text-primary" /> Professional Background
              </h2>

              <div className="space-y-10">
               
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Education</h3>
                  {doctor.education.map((edu, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                        <MdSchool size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-text">{edu.degree}</h4>
                        <p className="text-gray-600 font-medium">{edu.institute}, {edu.country}</p>
                        <p className="text-secondary font-bold mt-1 text-sm">Graduated {edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>

           
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Work History</h3>
                  {doctor.workExperiences.map((exp, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="h-12 w-12 rounded-xl bg-secondary text-white flex items-center justify-center shrink-0">
                        <MdWork size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-text">{exp.designation}</h4>
                        <p className="text-gray-600 font-medium">{exp.hospital}</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-primary mt-1">
                          <span>{exp.from}</span>
                          <HiOutlineArrowNarrowRight />
                          <span>{exp.to}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Patient Reviews Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-text flex items-center gap-3">
                  <MdStar className="text-primary" /> Patient Reviews
                </h2>
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                  <span className="text-3xl font-extrabold">{averageRating}</span>
                  <div className="flex flex-col">
                    <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => <MdStar key={i} size={16} className={i < Math.round(averageRating) ? 'text-amber-500' : 'text-gray-300'}/>)}
                    </div>
                    <span className="text-xs font-medium text-secondary">{reviews.length} total reviews</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-6 bg-bg/50 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-lg">
                          {rev.patientName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-text">{rev.patientName}</p>
                          <p className="text-xs text-gray-500">{new Date(rev.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-xs font-bold">
                        <MdStar size={16} />
                        {rev.rating.toFixed(1)}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed italic">&quot;{rev.comment}&quot;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>


          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-3">
                <MdPayments className="text-primary" /> Consultation Fees
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-bg border border-gray-100">
                  <span className="font-medium text-gray-600">New Visit</span>
                  <span className="text-xl font-bold text-primary">৳{doctor.fee.newPatient}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-bg border border-gray-100">
                  <span className="font-medium text-gray-600">Returning</span>
                  <span className="text-xl font-bold text-text">৳{doctor.fee.oldPatientWithin2Months}</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary rounded-3xl p-8 shadow-lg text-white sticky top-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <MdAccessTime className="text-white" /> Chamber Schedule
              </h2>
              <div className="space-y-4">
                {doctor.schedule.map((sch, index) => (
                  <div key={index} className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold">{sch.day}</span>
                      <span className="bg-primary text-white px-2 py-0.5 rounded text-[10px] font-black uppercase">
                        {sch.maxPatients} Seats
                      </span>
                    </div>
                    <div className="text-blue-100 flex items-center gap-2 font-medium">
                      <MdAccessTime size={18}/> {sch.startTime} - {sch.endTime}
                    </div>
                  </div>
                ))}
              </div>
              
              <AppointmentBtn doctor={doctor} className="w-full mt-8 bg-primary hover:bg-white hover:text-secondary text-white py-4 rounded-2xl font-bold transition-all transform active:scale-95 shadow-xl"/>
              
            </div>

          </div>
        </div>

        <div className="mt-12 text-center text-gray-400 text-[10px] uppercase tracking-widest">
          Last Updated: {new Date(doctor.createdAt).toLocaleDateString()}
        </div>
      </div>
    </section>
  );
}