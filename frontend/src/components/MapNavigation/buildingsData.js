import gymImage from './buildingimg/plm gym.png';
import gcaImage from './buildingimg/GCA.png';
import uacImage from './buildingimg/UAC.png';
import geeImage from './buildingimg/plm gee.png';
import jaaImage from './buildingimg/plm jaa.png';
import pridehallImage from './buildingimg/plm pride hall.png';
import tBImage from './buildingimg/plm tb.png';
import sscImage from './buildingimg/SSC.png';
import gaImage from './buildingimg/plm ga.png';
import chapelImage from './buildingimg/plm chapel.png';
import canteenImage from './buildingimg/plm canteen.png';
import gvImage from './buildingimg/GV.png';
import glImage from './buildingimg/GL.png';
import gkImage from './buildingimg/GK.png';
import gbImage from './buildingimg/GB.png';

export const buildings = [
  {
    id: "UAC",
    name: "University Activity Center",
    x: 0.30,
    y: 0.67,
    markerOffsetX: 55,
    markerOffsetY: 75,
    type: "monument",
    code: "UAC",
    floorPlanImage: uacImage,
  }, 
  {
    id: "Canteen",
    name: "Canteen",
    x: 0.5,
    y: 0.79,
    markerOffsetX: 50,
    markerOffsetY: 40,
    type: "gazebo",
    code: "CAN",
    floorPlanImage: canteenImage,
    floors: [
      {
        name: "Ground Floor",
        facilities: [
          "Food Stalls",
        ]
      },
      {
        name: "Second Floor",
        facilities: [
          "Lounge"
        ]
      }
    ],
  },
  {
    id: "GCA",
    name: "Gusaling Corazon Aquino",
    x: 0.51,
    y: 0.92,
    markerOffsetX: 41,
    markerOffsetY: 23,
    type: "hotel",
    code: "GCA",
    floorPlanImage: gcaImage,
    floors: [
      {
        name: "Ground Floor",
        facilities: [
          "Physical Facilities Maintenance Office (PFMO)",
          "Stockroom",
          "Pump Room",
          "Genset / Electrical Room",
          "College of Physical Therapy (CPT-Office Clinic)",
          "Classrooms 101 - 103",
          "Room 104 - OSDS, DMST, CWTS, NSTP",
          "Male/Female Comfort Room"
        ]
      },
      {
        name: "Second Floor",
        facilities: [
          "Commission on Audit (COA) Office, Storage Room",
          "CADD Room",
          "College of Architecture and Urban Planning (CAUP-Office)",
          "Audio Visual Room (AVR) 1A - 1B, 2A - 2B",
          "Male/Female Comfort Room"
        ]
      },
      {
        name: "Third Floor",
        facilities: [
          "Drawing Laboratory 2",
          "Classrooms 301 - 309",
          "Male/Female Comfort Room"
        ]
      }
    ],
  },
  {
    id: "GV",
    name: "Gusaling Villegas",
    x: 0.69,
    y: 0.86,
    markerOffsetX: 25,
    markerOffsetY: 40,
    type: "hotel",
    code: "GV",
    floorPlanImage: gvImage,
    floors: [
      {
        name: "Ground Floor",
        facilities: [
          "University Security Office (USO)",
          "University Health Services (UHS)",
          "Human Resources Development (HRD)",
          "Procurement Office",
          "University Guidance Center (UGC)",
          "CBGM-PRMIG",
          "Graduate School of Law (GSL)",
          "University ICT Center",
          "Manuel V. Pangilinan",
          "Mechanical Engineering Laboratory",
          "Male/Female, LGBT Comfort Room"
        ]
      },
      {
        name: "Second Floor",
        facilities: [
          "PLDT-SMART Foundation Hall",
          "Computer Laboratory - 1",
          "Computer Laboratory - 2", 
          "Rooms GV - 204 to 209",
          "Internal Audit Office (IAO)",
          "Office of the Vice President for Academic Affairs (OVPAA)",
          "Female Comfort Room",
        ]
      },
      {
        name: "Third Floor",
        facilities: [
          "One Meralco Foundation Hall",
          "Accenture",
          "Rooms GV - 304 to 310", 
          "Ang Pamantasan - AP",
          "CET College (Dean's & Chairperson's Office",
          "Graduate School of Engineering (GSE)",
          "Male Comfort Room",
        ]
      },
      {
        name: "Fourth Floor",
        facilities: [
          "Computer Laboratory - 3",
          "Computer Laboratory - 4", 
          "Computer Laboratory Office (CLO)"
        ]
      },
      {
        name: "Fifth Floor",
        facilities: [
          "Drawing Room - 1",
          "Drawing Room - 2", 
        ]
      }
    ],
  },
  {
    id: "GK",
    name: "Gusaling Katipunan",
    x: 0.77,
    y: 0.79,
    markerOffsetX: 20,
    markerOffsetY: 50,
    type: "hotel",
    code: "GK",
    floorPlanImage: gkImage,
    floors: [
      {
        name: "Basement Floor",
        facilities: [
          "University Library",
          "Filipiniana Section",
          "Graduate School Section",
          "Periodical Section",
          "Health & Science Section",
          "Technical Section",
          "Classroom (Basement)",
          "Thera Lab",
          "Mabuhay Integrated Learning Center",
          "Physical Facilities & Maintenance Office (PFMO)",
          "Male/Female Comfort Room"

        ]
      },
      {
        name: "Ground Floor",
        facilities: [
          "University Library",
          "Circulation Area",
          "Reading Area",
          "Librarian Office",
          "Internet Section",
          "Multi Media",
          "Male/Female Comfort Room"
        ]
      },
      {
        name: "Second Floor",
        facilities: [
          "Classrooms 200 -206",
          "College of Law Office",
          "Moot Court",
          "College of Law Library",
          "Male/Female Comfort Room"
        ]
      },
      {
        name: "Third Floor",
        facilities: [
          "College of Nursing (CN) / GSHS Office",
          "College of Nursing AVR / Laboratory",
          "Classrooms 301 - 308",
          "Bukod Tanging Bulwagan",
          "Male/Female Comfort Room"
        ]
      }
    ],
  },
  {
    id: "GB",
    name: "Gusaling Bagatsing",
    x: 0.90,
    y: 0.50,
    markerOffsetX: 15,
    markerOffsetY: 100,
    type: "hotel",
    code: "GB",
    floorPlanImage: gbImage,
    floors: [
      {
        name: "Ground Floor",
        facilities: [
          "Histology Laboratory Room",
          "Micro/Para and Photology Laboratory Room",
          "Science Laboratory Stockroom",
          "University Research Center",
          "Forum Hall",
          "Room 106 (Psychology Laboratory)",
          "Human Anatomy Laboratory Office",
        ]
      },
      {
        name: "Second Floor",
        facilities: [
          "PMGAI Office",
          "CM Student Council Room",
          "Student's Lounge",
          "Discussion Rooms 201 - 203",
          "Classrooms 208 - 209",
          "Central Laboratory Office",
          "Physiology/Biochemistry Pharmacology Laboratory Room - 201",
          "Publication-Guidance Stockroom",
          "College of Medicine Administrative Office",
          "Male/Female Comfort Room"
        ]
      },
      {
        name: "Second Floor",
        facilities: [
          "Classrooms 301 - 305",
          "CM Audio Visual Room",
          "Male/Female Comfort Room"
        ]
      }
    ],
  },
  {
    id: "Gym",
    name: "Raja Sulayman Gym",
    x: 0.84,
    y: 0.14,
    markerOffsetX: 30,
    markerOffsetY: 185,
    type: "gazebo",
    code: "GYM",
    floorPlanImage: gymImage,
    floors: [
      {
        name: "Ground Floor",
        facilities: [
          "Basketball Court",
          "Volleyball Court",
          "Badminton Court",
          "Gym Office",
          "PCACS Stockroom",
          "Male/Female Comfort Room, Shower Room"
        ]
      },
      {
        name: "Mezzanine Floor",
        facilities: [
          "Physical Education Office - CED",
          "Presidential Committee on arts, culture and sports (PCACS)",
          "Office"
        ]
      }
    ],
  },
  {
    id: "GL",
    name: "Gusaling Lacson",
    x: 0.63,
    y: 0.19,
    markerOffsetX: 45,
    markerOffsetY: 175,
    type: "hotel",
    code: "GL",
    floorPlanImage: glImage,
    floors: [
      {
        name: "Ground Floor",
        facilities: ["Tourism Laboratory"]
      },
      {
        name: "Second Floor",
        facilities: [
          "College of Humanities and Social Sciences Office", 
          "College of Business Administration Office", 
          "College of Accountancy Office", 
          "College of Public Administration Office", 
          "Faculty and Program Chair", 
          "Department of Music", 
          "Department of Social Work"
        ]
      },
      {
        name: "Third Floor",
        facilities: [
          "Violin Room", 
          "Voice Room", 
          "Piano Room"
        ]
      },
      {
        name: "Fourth Floor",
        facilities: [
          "Room 401-406"
        ]
      },
      {
        name: "Fifth Floor",
        facilities: [
          "Radio Laboratory", 
          "Faculty Lounge"
        ]
      },
      {
        name: "Sixth Floor",
        facilities: [
          "College of Science Office", 
          "Biology Instrumentation Room", 
          "Chemistry Laboratory"
        ]
      }
    ],
  },
  {
    id: "JAA",
    name: "Juan Albert Auditorium",
    x: 0.48,
    y: 0.16,
    markerOffsetX: 55,
    markerOffsetY: 180,
    type: "hotel",
    code: "JAA",
    floorPlanImage: jaaImage,
    floors: [
      {
        name: "Ground Floor",
        facilities: ["Male/Female Comfort Room"]
      },
      {
        name: "Second Floor",
        facilities: ["Auditorium"]
      }
    ],
  },
  {
    id: "SSC Office",
    name: "Supreme Student Council Office",
    x: 0.36,
    y: 0.15,
    markerOffsetX: 60,
    markerOffsetY: 185,
    type: "monument",
    code: "SSC",
    floorPlanImage: sscImage,
  },
  {
    id: "Entrep BLDG",
    name: "Entrep Building",
    x: 0.38,
    y: 0.08,
    markerOffsetX: 45,
    markerOffsetY: 12,
    type: "hotel",
    code: "ENT",
    floorPlanImage: null,
  },
  {
    id: "Executive BLDG",
    name: "Executive Building",
    x: 0.61,
    y: 0.06,
    markerOffsetX: 45,
    markerOffsetY: 15,
    type: "hotel",
    code: "EXE",
    floorPlanImage: null,
  },
  {
    id: "Chapel",
    name: "PLM Chapel",
    x: 0.12,
    y: 0.1,
    markerOffsetX: 80,
    markerOffsetY: 195,
    type: "chapel",
    code: "CHP",
    floorPlanImage: chapelImage,
  },
  {
    id: "GA",
    name: "Gusaling Atienza",
    x: 0.07,
    y: 0.43,
    markerOffsetX: 80,
    markerOffsetY: 120,
    type: "hotel",
    code: "GA",
    floorPlanImage: gaImage,
    floors: [
      {
        name: "Ground Floor",
        facilities: [
          "College of Information Systems and Technology Management", 
          "Procurement Office", 
          "Office of the Chairman / Board of Regents", 
          "Office of the University Secretary", 
          "Male/Female Comfort Room"
        ]
      },
      {
        name: "Second Floor",
        facilities: ["Classrooms"]
      }
    ],
  },
  {
    id: "GEE",
    name: "Gusaling Emilio Ejercito Sr.",
    x: 0.15,
    y: 0.53,
    markerOffsetX: 75,
    markerOffsetY: 90,
    type: "hotel",
    code: "GEE",
    floorPlanImage: geeImage,
    floors: [
      {
        name: "Ground Floor",
        facilities: [
          "Graduate School of Law", 
          "Finance Office",
        ]
      },
      {
        name: "Second Floor",
        facilities: [
          "Office of Executive Vice President", 
          "Office of the President", 
          "Classrooms 201 - 203, 206", 
          "Audio Visual Room", 
          "Laboratory Rooms 204 - 205", 
          "Male/Female Comfort Room"
        ]
      },
      {
        name: "Third Floor",
        facilities: [
          "Office of the Vice President for Administration", 
          "Office of the University Secretary", 
          "Office of the University Legal Counsel", 
          "Classrooms 301 - 305, 308 - 309", 
          "Laboratory Rooms 306 - 307", 
          "Male/Female Comfort Room"
        ]
      }
    ],
  },
  {
    id: "Tanghalang Bayan",
    name: "Tanghalang Bayan",
    x: 0.51,
    y: 0.57,
    markerOffsetX: 45,
    markerOffsetY: 100,
    type: "hotel",
    code: "TB",
    floorPlanImage: tBImage,
  },
  {
    id: "Pride Hall",
    name: "Pride Hall",
    x: 0.46,
    y: 0.64,
    markerOffsetX: 45,
    markerOffsetY: 80,
    type: "hotel",
    code: "PH",
    floorPlanImage: pridehallImage,
  }
];