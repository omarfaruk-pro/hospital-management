"use client";

import { getAllDepartments } from "@/app/actions/departments";
import { handleUpload } from "@/app/lib/handleCloudinaryUpload";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdClose, MdCloudUpload, MdOutlinePhotoCamera } from "react-icons/md";
import { BiLoaderAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import { addNewDoctor } from "@/app/actions/doctor";

export default function AddDoctorPage() {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        designation: "",
        registrationNumber: "",
        experienceYears: "",
        photoUrl: "",
        feeNew: "",
        feeOld: "",
        assistantName: "",
        assistantPhone: "",
        status: "",
        about: "",
    });

    const [educations, setEducations] = useState([{ degree: "", institute: "", country: "", year: "" }]);
    const [experiences, setExperiences] = useState([{ hospital: "", designation: "", from: "", to: "" }]);
    const [schedule, setSchedule] = useState([{ day: "", startTime: "", endTime: "", maxPatients: "" }]);

    useEffect(() => {
        const fetchDepartments = async () => {
            const res = await getAllDepartments();
            if (res.success) setDepartments(res.departments);
        };
        fetchDepartments();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleDepartmentSelect = (id) => {
        if (!selectedDepartments.includes(id)) setSelectedDepartments([...selectedDepartments, id]);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const res = await handleUpload(e, "image");
            setForm({ ...form, photoUrl: res.url });
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.designation || !form.registrationNumber || !form.feeNew || !form.feeOld || !selectedDepartments.length || !educations[0].degree || !schedule.length) {
            Swal.fire({
                icon: "error",
                title: "Missing Information",
                text: "Please provide all the required information.",
            })
            return;
        }
        const payload = {
            name: form.name,
            email: form.email,
            phone: form.phone,
            gender: form.gender,
            designation: form.designation,
            registrationNumber: form.registrationNumber,
            photoUrl: form.photoUrl,
            about: form.about,

            experienceYears: Number(form.experienceYears) || 0,
            departmentIds: selectedDepartments,
            education: educations[0].degree ? educations : null,
            workExperiences: experiences[0].hospital ? experiences : null,
            fee: { newPatient: Number(form.feeNew), oldPatientWithin2Months: Number(form.feeOld) },
            schedule,
            emergencyContact: { name: form.assistantName, phone: form.assistantPhone },
            status: form.status || "active",
            createdAt: new Date(),
        };
        const res = await addNewDoctor(payload);
        if (res.success) {
            Swal.fire({ icon: "success", title: "Doctor Added", text: "Doctor added successfully" });
        } else {
            Swal.fire({ icon: "error", title: "Error", text: res.message });
        }
    };

    return (
        <section className="bg-bg min-h-screen py-12">
            <div className="container max-w-5xl mx-auto">
                <h2 className="text-4xl font-black mb-8 tracking-tight">Add New Doctor</h2>

                <form onSubmit={handleSubmit} className="space-y-10 p-10 bg-white rounded-[3rem] shadow-xl shadow-blue-900/5 border border-gray-100">

                    {/* --- IMAGE UPLOAD SECTION --- */}
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary self-start ml-1">Profile Photo</h3>

                        <div className="relative group w-full">
                            <label className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-4xl cursor-pointer transition-all overflow-hidden
                                ${form.photoUrl ? 'border-primary/20 bg-primary/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>

                                {isUploading ? (
                                    <div className="flex flex-col items-center animate-pulse">
                                        <BiLoaderAlt className="w-12 h-12 text-primary animate-spin mb-2" />
                                        <p className="text-sm font-bold text-primary">Uploading to Cloud...</p>
                                    </div>
                                ) : form.photoUrl ? (
                                    <div className="relative w-62.5 h-62.5">
                                        <Image width={250} height={250} src={form.photoUrl} alt="Preview" className="object-cover w-full h-full" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <MdOutlinePhotoCamera className="text-white text-3xl" />
                                            <p className="text-white font-bold ml-2">Change Photo</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                        <div className="p-4 bg-primary/10 rounded-full mb-4">
                                            <MdCloudUpload className="w-10 h-10 text-primary" />
                                        </div>
                                        <p className="mb-1 text-sm font-bold text-gray-700">Click to upload </p>
                                        <p className="text-xs text-gray-400 font-medium tracking-wide">SVG, PNG, JPG or GIF (MAX. 800x800px)</p>
                                    </div>
                                )}

                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                            </label>

                            {form.photoUrl && !isUploading && (
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, photoUrl: "" })}
                                    className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                                >
                                    <MdClose size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Basic Info Section */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">General Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold" />
                            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold" />
                            <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" name="registrationNumber" placeholder="BMDC Registration" onChange={handleChange} className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold" />
                            <input type="number" name="feeNew" placeholder="New Patient Fee" onChange={handleChange} className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold" />
                            <input type="number" name="feeOld" placeholder="Old Patient Fee" onChange={handleChange} className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select name="status" onChange={handleChange} className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold appearance-none text-gray-500">
                                <option value="">Select Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <input type="text" name="experienceYears" placeholder="Experience Years" onChange={handleChange} className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold" />

                            <input type="url" name="photoUrl" value={form.photoUrl} placeholder="Photo URL" onChange={handleChange} className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold" readOnly />
                        </div>



                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <select name="gender" onChange={handleChange} className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-gray-500">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>

                            <input type="text" name="designation" placeholder="Designation" onChange={handleChange} className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold" />

                            <select onChange={(e) => handleDepartmentSelect(e.target.value)} className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold text-gray-500">
                                <option>Select Department</option>
                                {departments.map(dep => (
                                    <option key={dep._id} value={dep._id}>{dep.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {selectedDepartments.map(id => {
                                const dep = departments.find(d => d._id === id);
                                return (
                                    <div key={id} className="group flex items-center px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-wider border border-primary/5 transition-all">
                                        {dep?.name}
                                        <button type="button" onClick={() => setSelectedDepartments(selectedDepartments.filter(depId => depId !== id))} className="ml-2 hover:text-red-500 transition-colors">
                                            <MdClose size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Practice Schedule</h3>
                            <button
                                type="button"

                                onClick={() => setSchedule([...schedule, { day: "", startTime: "", endTime: "", maxPatients: "" }])}

                                className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all"

                            >

                                + Add Schedule

                            </button>

                        </div>

                        <div className="space-y-4">

                            {schedule.map((_, i) => (

                                <div key={i} className="p-6 bg-bg/50 rounded-3xl border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 relative group items-end">

                                    {(schedule.length > 1 && i == schedule.length - 1) && (

                                        <button

                                            type="button"

                                            onClick={() => setSchedule(schedule.filter((_, j) => j !== i))}

                                            className="absolute -top-2 -right-2 bg-red-500 rounded-full h-4 w-4 flex items-center justify-center text-white font-bold"

                                        >

                                            <MdClose size={12} />

                                        </button>

                                    )}

                                    <select placeholder="Day" className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm" onChange={(e) => {

                                        const newSch = [...schedule];

                                        newSch[i].day = e.target.value;

                                        setSchedule(newSch);

                                    }} >

                                        <option value="">Select Day</option>

                                        <option value="saturday">Saturday</option>

                                        <option value="sunday">Sunday</option>

                                        <option value="monday">Monday</option>

                                        <option value="tuesday">Tuesday</option>

                                        <option value="wednesday">Wednesday</option>

                                        <option value="thursday">Thursday</option>

                                        <option value="friday">Friday</option>

                                    </select>



                                    <label htmlFor="startTime">

                                        Start Time

                                        <input id="startTime" placeholder="Start Time" type="time" className=" p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm block w-full" onChange={(e) => {

                                            const newSch = [...schedule];

                                            newSch[i].startTime = e.target.value;

                                            setSchedule(newSch);

                                        }} />

                                    </label>

                                    <label htmlFor="endTime">

                                        End Time

                                        <input id="endTime" placeholder="End Time" type="time" className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm block w-full" onChange={(e) => {

                                            const newSch = [...schedule];

                                            newSch[i].endTime = e.target.value;

                                            setSchedule(newSch);

                                        }} />

                                    </label>

                                    <input placeholder="Max Patients" type="number" className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm" onChange={(e) => {

                                        const newSch = [...schedule];

                                        newSch[i].maxPatients = e.target.value;

                                        setSchedule(newSch);

                                    }} />

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* Education Section */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-4">

                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Academic Background</h3>

                            <button
                                type="button"
                                onClick={() => setEducations([...educations, { degree: "", institute: "", country: "", year: "" }])}

                                className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all"
                            >
                                + Add Education
                            </button>
                        </div>

                        <div className="space-y-4">

                            {educations.map((edu, i) => (

                                <div key={i} className="p-6 bg-bg/50 rounded-3xl border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 relative group">

                                    {(educations.length > 1 && i == educations.length - 1) && (

                                        <button

                                            type="button"

                                            onClick={() => setEducations(educations.filter((_, j) => j !== i))}

                                            className="absolute -top-2 -right-2 bg-red-500 rounded-full h-4 w-4 flex items-center justify-center text-white font-bold"

                                        >

                                            <MdClose size={12} />

                                        </button>

                                    )}

                                    <input placeholder="Degree" className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm" onChange={(e) => {

                                        const newEdu = [...educations];

                                        newEdu[i].degree = e.target.value;

                                        setEducations(newEdu);

                                    }} />

                                    <input placeholder="Institute" className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm" onChange={(e) => {

                                        const newEdu = [...educations];

                                        newEdu[i].institute = e.target.value;

                                        setEducations(newEdu);

                                    }} />

                                    <input placeholder="Country" className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm" onChange={(e) => {

                                        const newEdu = [...educations];

                                        newEdu[i].country = e.target.value;

                                        setEducations(newEdu);

                                    }} />

                                    <input placeholder="Year" className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm" onChange={(e) => {

                                        const newEdu = [...educations];

                                        newEdu[i].year = e.target.value;

                                        setEducations(newEdu);

                                    }} />

                                </div>

                            ))}

                        </div>

                    </div>


                    {/* Work Experience Section */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Professional Experience</h3>
                            <button
                                type="button"
                                onClick={() => setExperiences([...experiences, { hospital: "", designation: "", from: "", to: "" }])}
                                className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all"
                            >
                                + Add Experience
                            </button>
                        </div>

                        <div className="space-y-4">
                            {experiences.map((exp, i) => (
                                <div key={i} className="p-6 bg-bg/50 rounded-3xl border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                                    {(experiences.length > 1 && i == experiences.length - 1) && (
                                        <button
                                            type="button"
                                            onClick={() => setExperiences(experiences.filter((_, j) => j !== i))}
                                            className="absolute -top-2 -right-2 bg-red-500 rounded-full h-4 w-4 flex items-center justify-center text-white font-bold"
                                        >
                                            <MdClose size={12} />
                                        </button>
                                    )}

                                    <input placeholder="Hospital" className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm" onChange={(e) => {

                                        const newExp = [...experiences];

                                        newExp[i].hospital = e.target.value;

                                        setExperiences(newExp);

                                    }} />

                                    <input placeholder="Designation" className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm" onChange={(e) => {

                                        const newExp = [...experiences];

                                        newExp[i].designation = e.target.value;

                                        setExperiences(newExp);

                                    }} />

                                    <input placeholder="From (Year)" className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm" onChange={(e) => {

                                        const newExp = [...experiences];

                                        newExp[i].from = e.target.value;

                                        setExperiences(newExp);

                                    }} />

                                    <input placeholder="To (Year)" className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm" onChange={(e) => {

                                        const newExp = [...experiences];

                                        newExp[i].to = e.target.value;

                                        setExperiences(newExp);

                                    }} />

                                </div>

                            ))}

                        </div>



                        <div className="space-y-4">

                            <div className="p-6 bg-bg/50 rounded-3xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 relative">

                                <input type="text" placeholder="Assistant Name" name="assistantName" onChange={handleChange} className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm" />

                                <input type="tel" placeholder="Assistant Phone" name="assistantPhone" onChange={handleChange} className="p-3 bg-white border border-gray-100 rounded-xl font-bold text-sm" />

                            </div>

                        </div>

                    </div>

                    <div>
                        <textarea name="about" placeholder="Write about doctor shortly" rows="5" onChange={handleChange} className="w-full p-4 bg-bg rounded-2xl outline-none focus:ring-2 ring-primary/10 transition-all font-bold"></textarea>
                    </div>



                    {/* Finalize Button */}
                    <button type="submit" disabled={isUploading} className="w-full bg-primary disabled:bg-gray-400 text-white py-6 rounded-4xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-[0.98] transition-all">
                        {isUploading ? "Please wait for upload..." : "Finalize & Add Doctor"}
                    </button>
                </form>
            </div>
        </section>
    );
}