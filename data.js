his is data that i am getting from server. 

create a nice ui with next and tailwind. 

my color theme is :   --color-primary:#2563EB;

  --color-secondary:#1E40AF;

  --color-bg:#F9FAFB;

  --color-text:#111827;



use section>.container>others content. this format. 



here is data: 

{

  _id: '69dbb2d43fa4936c2f50f213',

  name: 'Dr. Arif Rahman',

  education: [

    {

      degree: 'MBBS',

      institute: 'Dhaka Medical College',

      country: 'Bangladesh',

      year: 2009

    }

  ],

  experienceYears: 12,

  workExperiences: [

    {

      hospital: 'Square Hospital',

      designation: 'Consultant',

      from: '2016',

      to: '2020'

    }

  ],

  designation: 'Consultant',

  fee: { newPatient: 800, oldPatientWithin2Months: 600 },

  schedule: [

    {

      day: 'Sunday',

      startTime: '16:00',

      endTime: '20:00',

      maxPatients: 30

    }

  ],

  emergencyContact: { name: 'Assistant', phone: '01900000001' },

  photoUrl: 'https://static.vecteezy.com/system/resources/thumbnails/028/287/384/small/a-mature-indian-male-doctor-on-a-white-background-ai-generated-photo.jpg',

  createdAt: '2026-04-12T00:00:00.000Z',

  departments: [

    {

      _id: new ObjectId('69dba0e53fa4936c2f50f1fd'),

      name: 'General Medicine',

      slug: 'general-medicine',

      isActive: true,

      createdAt: '2026-04-12T00:00:00.000Z'

    },

    {

      _id: new ObjectId('69dba0e53fa4936c2f50f1fe'),

      name: 'Cardiology',

      slug: 'cardiology',

      isActive: true,

      createdAt: '2026-04-12T00:00:00.000Z'

    }

  ]

}