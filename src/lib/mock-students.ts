// Phase 3 - Step 7: realistic mock students for the officer pages (no backend yet)

export type StudentRecord = {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  branch: "CSE" | "IT" | "ECE" | "ME";
  cgpa: number;
  backlogs: number;
  skills: string[];
  placedAt?: string; // company name, only when placed
};

export const mockStudents: StudentRecord[] = [
  { id: "st-01", name: "Deepak", rollNo: "233114", email: "deepak@student.example.com", branch: "CSE", cgpa: 8.1, backlogs: 0, skills: ["React", "Next.js", "DSA", "Python"] },
  { id: "st-02", name: "Aarav Sharma", rollNo: "233101", email: "aarav@student.example.com", branch: "CSE", cgpa: 8.6, backlogs: 0, skills: ["Java", "SQL", "Spring Boot"], placedAt: "FinEdge Technologies" },
  { id: "st-03", name: "Riya Verma", rollNo: "233122", email: "riya@student.example.com", branch: "IT", cgpa: 7.4, backlogs: 0, skills: ["Python", "Machine Learning", "SQL"] },
  { id: "st-04", name: "Karan Singh", rollNo: "233140", email: "karan@student.example.com", branch: "ECE", cgpa: 6.8, backlogs: 1, skills: ["C++", "Embedded C", "IoT"] },
  { id: "st-05", name: "Neha Gupta", rollNo: "233156", email: "neha@student.example.com", branch: "CSE", cgpa: 9.0, backlogs: 0, skills: ["React", "Node.js", "AWS"], placedAt: "CloudKart" },
  { id: "st-06", name: "Mohit Yadav", rollNo: "233163", email: "mohit@student.example.com", branch: "IT", cgpa: 7.9, backlogs: 0, skills: ["Docker", "FastAPI", "PostgreSQL"] },
  { id: "st-07", name: "Sanya Malhotra", rollNo: "233171", email: "sanya@student.example.com", branch: "CSE", cgpa: 7.2, backlogs: 0, skills: ["Figma", "React", "Tailwind CSS"] },
  { id: "st-08", name: "Vikas Chauhan", rollNo: "233185", email: "vikas@student.example.com", branch: "ME", cgpa: 6.4, backlogs: 2, skills: ["AutoCAD", "SolidWorks"] },
  { id: "st-09", name: "Ishita Bansal", rollNo: "233192", email: "ishita@student.example.com", branch: "IT", cgpa: 8.3, backlogs: 0, skills: ["Python", "Data Analysis", "Power BI"] },
  { id: "st-10", name: "Rahul Kumar", rollNo: "233204", email: "rahul@student.example.com", branch: "ECE", cgpa: 7.1, backlogs: 0, skills: ["Python", "Networking", "Linux"] },
  { id: "st-11", name: "Tanvi Joshi", rollNo: "233215", email: "tanvi@student.example.com", branch: "CSE", cgpa: 8.8, backlogs: 0, skills: ["TypeScript", "React", "GraphQL"], placedAt: "TechNova Solutions" },
  { id: "st-12", name: "Arjun Mehta", rollNo: "233228", email: "arjun@student.example.com", branch: "CSE", cgpa: 7.6, backlogs: 0, skills: ["Java", "DSA", "SQL"] },
];

export function getStudent(id: string): StudentRecord | undefined {
  return mockStudents.find((s) => s.id === id);
}
