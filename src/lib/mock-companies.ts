// Phase 3: Mock companies data for placement cell (no backend yet)

export interface MockCompany {
  id: string;
  name: string;
  industry: string;
  location: string;
  website: string;
  about: string;
  hrContact: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  totalHires: number;
  avgPackageLpa: string;
  highestPackageLpa: string;
  hiringSince: string;
}

export const mockCompanies: MockCompany[] = [
  {
    id: "co-1",
    name: "TechNova Solutions",
    industry: "IT Services",
    location: "Noida, UP",
    website: "https://technovasolutions.in",
    about:
      "TechNova Solutions is a premier digital engineering and enterprise software consultancy. They partner with Fortune 500 financial and healthcare firms to deliver modern cloud platforms and AI-driven products. On campus, they have been a reliable Day-1 recruiter for over 4 years.",
    hrContact: {
      name: "Priya Sharma",
      role: "Lead Campus Recruiter",
      email: "priya.sharma@technova.in",
      phone: "+91 98112 34567",
    },
    totalHires: 42,
    avgPackageLpa: "7.2 LPA",
    highestPackageLpa: "12 LPA",
    hiringSince: "2022",
  },
  {
    id: "co-2",
    name: "CloudKart",
    industry: "E-Commerce",
    location: "Gurugram, Haryana",
    website: "https://cloudkart.com",
    about:
      "CloudKart is one of India's fastest scaling quick-commerce platforms, powering hyper-local supply chains across 40+ cities. The engineering team designs distributed microservices handling millions of transactions daily, with strong mentorship for campus hires.",
    hrContact: {
      name: "Rahul Verma",
      role: "Senior Talent Acquisition Specialist",
      email: "r.verma@cloudkart.com",
      phone: "+91 98710 88921",
    },
    totalHires: 28,
    avgPackageLpa: "10.5 LPA",
    highestPackageLpa: "16 LPA",
    hiringSince: "2023",
  },
  {
    id: "co-3",
    name: "DataBridge Analytics",
    industry: "Analytics & AI",
    location: "Bengaluru, Karnataka",
    website: "https://databridge.ai",
    about:
      "DataBridge Analytics helps enterprise retail and fintech clients turn raw transaction streams into actionable intelligence. Their campus recruits work on predictive analytics pipelines, machine learning feature stores, and real-time visualization dashboards.",
    hrContact: {
      name: "Ananya Iyer",
      role: "University Relations Partner",
      email: "ananya.i@databridge.ai",
      phone: "+91 80234 56789",
    },
    totalHires: 19,
    avgPackageLpa: "8.0 LPA",
    highestPackageLpa: "14 LPA",
    hiringSince: "2021",
  },
  {
    id: "co-4",
    name: "Pixelwave Studio",
    industry: "Design & Media",
    location: "Delhi NCR (On-site)",
    website: "https://pixelwave.design",
    about:
      "Pixelwave Studio is an award-winning digital experience studio engineering web applications, interactive design systems, and design-tech solutions for consumer startups across India and Southeast Asia.",
    hrContact: {
      name: "Aman Kapoor",
      role: "Design & Tech Hiring Lead",
      email: "careers@pixelwave.design",
      phone: "+91 99105 44321",
    },
    totalHires: 11,
    avgPackageLpa: "6.0 LPA",
    highestPackageLpa: "8.5 LPA",
    hiringSince: "2023",
  },
  {
    id: "co-5",
    name: "SecureNet Systems",
    industry: "Cybersecurity",
    location: "Pune, Maharashtra",
    website: "https://securenet-systems.io",
    about:
      "SecureNet Systems provides zero-trust network infrastructure and offensive security testing for banking institutions. They run a dedicated 6-week security operations bootcamp for all fresh campus recruits.",
    hrContact: {
      name: "Vikram Malhotra",
      role: "Director - People & Culture",
      email: "v.malhotra@securenet.io",
      phone: "+91 20678 12340",
    },
    totalHires: 25,
    avgPackageLpa: "9.0 LPA",
    highestPackageLpa: "15 LPA",
    hiringSince: "2020",
  },
  {
    id: "co-6",
    name: "FinEdge Technologies",
    industry: "Fintech",
    location: "Bengaluru, Karnataka",
    website: "https://finedge.tech",
    about:
      "FinEdge Technologies is a Series B funded fintech powering unified payments, cross-border settlements, and credit verification APIs. They hire aggressively from premier engineering colleges for backend and full stack teams.",
    hrContact: {
      name: "Sneha Nair",
      role: "Campus Programs Manager",
      email: "sneha.n@finedge.tech",
      phone: "+91 97422 11980",
    },
    totalHires: 18,
    avgPackageLpa: "12.0 LPA",
    highestPackageLpa: "18 LPA",
    hiringSince: "2022",
  },
  {
    id: "co-7",
    name: "LearnLoop",
    industry: "EdTech",
    location: "Noida, UP",
    website: "https://learnloop.org",
    about:
      "LearnLoop is building cohort-based peer learning infrastructure for technical higher education. Their interns and junior developers get direct exposure to full-stack Next.js and real-time collaboration engines.",
    hrContact: {
      name: "Tanvi Saxena",
      role: "HR Generalist",
      email: "tanvi@learnloop.org",
      phone: "+91 98188 77654",
    },
    totalHires: 14,
    avgPackageLpa: "5.5 LPA",
    highestPackageLpa: "7.5 LPA",
    hiringSince: "2024",
  },
  {
    id: "co-8",
    name: "GreenGrid Energy",
    industry: "Clean Energy & IoT",
    location: "Chennai, Tamil Nadu",
    website: "https://greengridenergy.in",
    about:
      "GreenGrid Energy develops smart metering, IoT telemetry units, and cloud power analytics for renewable solar-wind microgrids. They actively recruit students from Electrical, Electronics, and Computer Science branches.",
    hrContact: {
      name: "Karthik Subramanian",
      role: "Head of Talent Acquisition",
      email: "karthik.s@greengridenergy.in",
      phone: "+91 44281 99011",
    },
    totalHires: 12,
    avgPackageLpa: "8.2 LPA",
    highestPackageLpa: "11 LPA",
    hiringSince: "2022",
  },
];

export function getCompanyById(id: string): MockCompany | undefined {
  return mockCompanies.find((c) => c.id === id);
}

