// Phase 3: Mock applicant records for Officer Vacancy Details preview

export interface MockApplicant {
  id: string;
  name: string;
  rollNo: string;
  branch: string;
  cgpa: number;
  status: "Shortlisted" | "Applied" | "Interview" | "Offered" | "Rejected";
  appliedOn: string;
}

export const mockApplicantsByVacancy: Record<string, MockApplicant[]> = {
  "v-101": [
    { id: "app-101", name: "Deepak Gautam", rollNo: "233114", branch: "CSE", cgpa: 8.1, status: "Shortlisted", appliedOn: "2026-10-12" },
    { id: "app-102", name: "Aarav Sharma", rollNo: "233101", branch: "CSE", cgpa: 8.6, status: "Interview", appliedOn: "2026-10-11" },
    { id: "app-103", name: "Riya Verma", rollNo: "233122", branch: "IT", cgpa: 7.4, status: "Applied", appliedOn: "2026-10-14" },
    { id: "app-104", name: "Neha Gupta", rollNo: "233156", branch: "CSE", cgpa: 9.0, status: "Offered", appliedOn: "2026-10-10" },
    { id: "app-105", name: "Karan Singh", rollNo: "233140", branch: "ECE", cgpa: 6.8, status: "Rejected", appliedOn: "2026-10-13" },
    { id: "app-106", name: "Simran Kaur", rollNo: "233167", branch: "CSE", cgpa: 7.9, status: "Applied", appliedOn: "2026-10-15" },
    { id: "app-107", name: "Arjun Patel", rollNo: "233178", branch: "IT", cgpa: 8.3, status: "Shortlisted", appliedOn: "2026-10-11" },
  ],
  "v-102": [
    { id: "app-201", name: "Priya Reddy", rollNo: "233189", branch: "CSE", cgpa: 8.8, status: "Shortlisted", appliedOn: "2026-10-09" },
    { id: "app-202", name: "Mohit Kumar", rollNo: "233195", branch: "IT", cgpa: 7.6, status: "Applied", appliedOn: "2026-10-10" },
    { id: "app-203", name: "Ananya Das", rollNo: "233201", branch: "CSE", cgpa: 8.5, status: "Interview", appliedOn: "2026-10-08" },
    { id: "app-204", name: "Vikram Mehra", rollNo: "233208", branch: "IT", cgpa: 8.0, status: "Shortlisted", appliedOn: "2026-10-09" },
    { id: "app-205", name: "Tanmay Joshi", rollNo: "233214", branch: "CSE", cgpa: 7.8, status: "Rejected", appliedOn: "2026-10-11" },
  ],
  "v-103": [
    { id: "app-301", name: "Rohan Mehta", rollNo: "233210", branch: "ECE", cgpa: 7.6, status: "Applied", appliedOn: "2026-10-06" },
    { id: "app-302", name: "Kavya Nair", rollNo: "233215", branch: "CSE", cgpa: 8.0, status: "Shortlisted", appliedOn: "2026-10-05" },
    { id: "app-303", name: "Aditya Singh", rollNo: "233220", branch: "IT", cgpa: 7.8, status: "Rejected", appliedOn: "2026-10-07" },
    { id: "app-304", name: "Ishita Gupta", rollNo: "233225", branch: "EE", cgpa: 6.9, status: "Applied", appliedOn: "2026-10-06" },
    { id: "app-305", name: "Suresh Pillai", rollNo: "233232", branch: "ECE", cgpa: 7.3, status: "Applied", appliedOn: "2026-10-07" },
  ],
  "v-105": [
    { id: "app-501", name: "Rahul Chauhan", rollNo: "233240", branch: "CSE", cgpa: 7.5, status: "Rejected", appliedOn: "2026-09-10" },
    { id: "app-502", name: "Pooja Sharma", rollNo: "233245", branch: "ECE", cgpa: 7.1, status: "Shortlisted", appliedOn: "2026-09-08" },
    { id: "app-503", name: "Nikhil Saxena", rollNo: "233250", branch: "IT", cgpa: 7.3, status: "Rejected", appliedOn: "2026-09-12" },
    { id: "app-504", name: "Shweta Roy", rollNo: "233254", branch: "CSE", cgpa: 8.2, status: "Offered", appliedOn: "2026-09-07" },
    { id: "app-505", name: "Harish Varma", rollNo: "233258", branch: "ECE", cgpa: 7.0, status: "Shortlisted", appliedOn: "2026-09-09" },
  ],
  "v-106": [
    { id: "app-601", name: "Varun Tiwari", rollNo: "233230", branch: "CSE", cgpa: 8.9, status: "Shortlisted", appliedOn: "2026-10-13" },
    { id: "app-602", name: "Meera Iyer", rollNo: "233235", branch: "IT", cgpa: 8.2, status: "Applied", appliedOn: "2026-10-14" },
    { id: "app-603", name: "Abhinav Rao", rollNo: "233239", branch: "CSE", cgpa: 8.6, status: "Interview", appliedOn: "2026-10-13" },
    { id: "app-604", name: "Tanya Kapoor", rollNo: "233244", branch: "IT", cgpa: 8.4, status: "Shortlisted", appliedOn: "2026-10-14" },
  ],
  "v-108": [
    { id: "app-801", name: "Divya Rajan", rollNo: "233255", branch: "ECE", cgpa: 7.8, status: "Applied", appliedOn: "2026-10-20" },
    { id: "app-802", name: "Siddharth Menon", rollNo: "233260", branch: "EE", cgpa: 7.5, status: "Applied", appliedOn: "2026-10-19" },
    { id: "app-803", name: "Pranav Bhatt", rollNo: "233265", branch: "CSE", cgpa: 8.1, status: "Shortlisted", appliedOn: "2026-10-20" },
  ],
};

// Default fallback generator if a vacancy has no explicit mock list
export function getApplicantsForVacancy(vacancyId: string): MockApplicant[] {
  if (mockApplicantsByVacancy[vacancyId]) {
    return mockApplicantsByVacancy[vacancyId];
  }
  return [];
}

