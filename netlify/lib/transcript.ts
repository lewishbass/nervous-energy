export interface Class {
	subject: string;
	course: string;
	campus: string;
	level: string;
	title: string;
	grade: string | null;
	credit_hours: number;
	quality_points: number | null;
  tag: "Mathematics" | "Computer Science" | "Computer Engineering" | "Machine Learning" | "Pathways";
}

export interface Semester {
	semester_name: string;
	term_code: string;
	institution: string;
	start_date: string | null;
	end_date: string | null;
	academic_level: string;
	primary_college: string | null;
	primary_major: string | null;
	academic_standing: string | null;
	attempt_hours: number;
	passed_hours: number | null;
	earned_hours: number | null;
	gpa_hours: number | null;
	quality_points: number | null;
	term_gpa: number | null;
	cumulative_gpa: number | null;
	classes: Class[];
}


export const transcript: Semester[] = 
[
    {
      "semester_name": "Spring 2017",
      "term_code": "Spring 2017",
      "institution": "Northern Virginia Community College",
      "start_date": "2017-01-20",
      "end_date": "2017-05-11",
      "academic_level": "Associates",
      "primary_college": "General",
      "primary_major": "HS-Coll Cred Only OR Home Sch Non-Curricular",
      "academic_standing": "Good Standing",
      "attempt_hours": 3.0,
      "passed_hours": 3.0,
      "earned_hours": 3.0,
      "gpa_hours": 3.0,
      "quality_points": 12.0,
      "term_gpa": 4.0,
      "cumulative_gpa": 4.0,
      "classes": [
        {
          "subject": "MTH",
          "course": "163",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Precalculus I",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Mathematics"
        }
      ]
    },
    {
      "semester_name": "Fall 2017",
      "term_code": "Fall 2017",
      "institution": "Northern Virginia Community College",
      "start_date": "2017-08-25",
      "end_date": "2017-12-15",
      "academic_level": "Associates",
      "primary_college": "General",
      "primary_major": "HS-Coll Cred Only OR Home Sch Non-Curricular",
      "academic_standing": "Good Standing",
      "attempt_hours": 8.0,
      "passed_hours": 8.0,
      "earned_hours": 8.0,
      "gpa_hours": 8.0,
      "quality_points": 27.0,
      "term_gpa": 3.375,
      "cumulative_gpa": 3.545,
      "classes": [
        {
          "subject": "ENG",
          "course": "111",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "College Compositn I",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Pathways"
        },
        {
          "subject": "MTH",
          "course": "173",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Calcls Wth Ana Geo I",
          "grade": "B",
          "credit_hours": 5.0,
          "quality_points": 15.0,
          "tag": "Mathematics"
        }
      ]
    },
    {
      "semester_name": "Spring 2018",
      "term_code": "Spring 2018",
      "institution": "Northern Virginia Community College",
      "start_date": "2018-01-20",
      "end_date": "2018-05-11",
      "academic_level": "Associates",
      "primary_college": "General",
      "primary_major": "HS-Coll Cred Only OR Home Sch Non-Curricular",
      "academic_standing": "Good Standing",
      "attempt_hours": 10.0,
      "passed_hours": 10.0,
      "earned_hours": 10.0,
      "gpa_hours": 10.0,
      "quality_points": 30.0,
      "term_gpa": 3.0,
      "cumulative_gpa": 3.286,
      "classes": [
        {
          "subject": "MTH",
          "course": "174",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Calc/Analytic Geo II",
          "grade": "B",
          "credit_hours": 5.0,
          "quality_points": 15.0,
          "tag": "Mathematics"
        },
        {
          "subject": "PHY",
          "course": "231",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Gen Univ Physics I",
          "grade": "B",
          "credit_hours": 5.0,
          "quality_points": 15.0,
          "tag": "Pathways"
        }
      ]
    },
    {
      "semester_name": "Summer 2018",
      "term_code": "Summer 2018",
      "institution": "Northern Virginia Community College",
      "start_date": "2018-05-19",
      "end_date": "2018-08-11",
      "academic_level": "Associates",
      "primary_college": "General",
      "primary_major": "AS-Science / Mathematics Major",
      "academic_standing": "Good Standing",
      "attempt_hours": 7.0,
      "passed_hours": 7.0,
      "earned_hours": 7.0,
      "gpa_hours": 7.0,
      "quality_points": 28.0,
      "term_gpa": 4.0,
      "cumulative_gpa": 3.464,
      "classes": [
        {
          "subject": "MTH",
          "course": "277",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Vector Calculus",
          "grade": "A",
          "credit_hours": 4.0,
          "quality_points": 16.0,
          "tag": "Mathematics"
        },
        {
          "subject": "MTH",
          "course": "285",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Linear Algebra",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Mathematics"
        }
      ]
    },
    {
      "semester_name": "Fall 2018",
      "term_code": "Fall 2018",
      "institution": "Northern Virginia Community College",
      "start_date": "2018-08-25",
      "end_date": "2018-12-15",
      "academic_level": "Associates",
      "primary_college": "General",
      "primary_major": "AS-Engineering Major",
      "academic_standing": "Good Standing",
      "attempt_hours": 20.0,
      "passed_hours": 20.0,
      "earned_hours": 20.0,
      "gpa_hours": 20.0,
      "quality_points": 71.0,
      "term_gpa": 3.55,
      "cumulative_gpa": 3.5,
      "classes": [
        {
          "subject": "CHM",
          "course": "111",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "General Chemistry I",
          "grade": "A",
          "credit_hours": 4.0,
          "quality_points": 16.0,
          "tag": "Pathways"
        },
        {
          "subject": "CSC",
          "course": "202",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Computer Science II",
          "grade": "B",
          "credit_hours": 4.0,
          "quality_points": 12.0,
          "tag": "Computer Science"
        },
        {
          "subject": "CST",
          "course": "100",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Prin of Public Spkng",
          "grade": "B",
          "credit_hours": 3.0,
          "quality_points": 9.0,
          "tag": "Pathways"
        },
        {
          "subject": "EGR",
          "course": "120",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Intro to Engineering",
          "grade": "A",
          "credit_hours": 2.0,
          "quality_points": 8.0,
          "tag": "Computer Engineering"
        },
        {
          "subject": "ENG",
          "course": "112",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Coll Composition II",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Pathways"
        },
        {
          "subject": "PLS",
          "course": "211",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "U.S. Government I",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Pathways"
        },
        {
          "subject": "SDV",
          "course": "100",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "College Success Skills",
          "grade": "C",
          "credit_hours": 1.0,
          "quality_points": 2.0,
          "tag": "Pathways"
        }
      ]
    },
    {
      "semester_name": "Spring 2019",
      "term_code": "Spring 2019",
      "institution": "Northern Virginia Community College",
      "start_date": "2019-01-20",
      "end_date": "2019-05-11",
      "academic_level": "Associates",
      "primary_college": "General",
      "primary_major": "AS-Engineering Major",
      "academic_standing": "Good Standing",
      "attempt_hours": 24.0,
      "passed_hours": 24.0,
      "earned_hours": 24.0,
      "gpa_hours": 24.0,
      "quality_points": 91.0,
      "term_gpa": 3.792,
      "cumulative_gpa": 3.597,
      "classes": [
        {
          "subject": "ART",
          "course": "101",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Hist & Appr of Art I",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Pathways"
        },
        {
          "subject": "CHM",
          "course": "112",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "General Chemistry II",
          "grade": "A",
          "credit_hours": 4.0,
          "quality_points": 16.0,
          "tag": "Pathways"
        },
        {
          "subject": "ECO",
          "course": "201",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Princ of Macroecon",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Pathways"
        },
        {
          "subject": "ENG",
          "course": "241",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Surv of Amer Lit I",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Pathways"
        },
        {
          "subject": "MTH",
          "course": "267",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Differential Equations",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Mathematics"
        },
        {
          "subject": "MTH",
          "course": "288",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Discrete Mathematics",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Mathematics"
        },
        {
          "subject": "PHY",
          "course": "232",
          "campus": "Woodbridge",
          "level": "Transfer",
          "title": "Gen Univ Physics II",
          "grade": "B",
          "credit_hours": 5.0,
          "quality_points": 15.0,
          "tag": "Pathways"
        }
      ]
    },
    {
      "semester_name": "Summer II 2019",
      "term_code": "Summer II 2019",
      "institution": "Virginia Tech",
      "start_date": "2019-05-27",
      "end_date": "2019-08-15",
      "academic_level": "Undergraduate",
      "primary_college": "Engineering",
      "primary_major": "GE - General Engineering",
      "academic_standing": "Good Standing",
      "attempt_hours": 3.0,
      "passed_hours": 3.0,
      "earned_hours": 3.0,
      "gpa_hours": 3.0,
      "quality_points": 12.0,
      "term_gpa": 4.0,
      "cumulative_gpa": 4.0,
      "classes": [
        {
          "subject": "ECE",
          "course": "1004",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Introduction to ECE Concepts",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Computer Engineering"
        }
      ]
    },
    {
      "semester_name": "Fall 2019",
      "term_code": "Fall 2019",
      "institution": "Virginia Tech",
      "start_date": "2019-08-25",
      "end_date": "2019-12-10",
      "academic_level": "Undergraduate",
      "primary_college": "Engineering",
      "primary_major": "GE - General Engineering",
      "academic_standing": "Good Standing",
      "attempt_hours": 17.0,
      "passed_hours": 17.0,
      "earned_hours": 17.0,
      "gpa_hours": 17.0,
      "quality_points": 46.4,
      "term_gpa": 2.72,
      "cumulative_gpa": 2.92,
      "classes": [
        {
          "subject": "ECE",
          "course": "2024",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Circuits and Devices",
          "grade": "B",
          "credit_hours": 3.0,
          "quality_points": 9.0,
          "tag": "Computer Engineering"
        },
        {
          "subject": "ECE",
          "course": "2514",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Computational Engineering",
          "grade": "A-",
          "credit_hours": 3.0,
          "quality_points": 11.1,
          "tag": "Computer Engineering"
        },
        {
          "subject": "ECE",
          "course": "2544",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Fundamentals Digital Systems",
          "grade": "D",
          "credit_hours": 3.0,
          "quality_points": 3.0,
          "tag": "Computer Engineering"
        },
        {
          "subject": "ENGE",
          "course": "1216",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Foundations of Engineering",
          "grade": "A-",
          "credit_hours": 2.0,
          "quality_points": 7.4,
          "tag": "Computer Engineering"
        },
        {
          "subject": "MATH",
          "course": "3034",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Introduction to Proofs",
          "grade": "C",
          "credit_hours": 3.0,
          "quality_points": 6.0,
          "tag": "Mathematics"
        },
        {
          "subject": "PSCI",
          "course": "1014",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "US Gov & Politics",
          "grade": "B+",
          "credit_hours": 3.0,
          "quality_points": 9.9,
          "tag": "Pathways"
        }
      ]
    },
    {
      "semester_name": "Spring 2020",
      "term_code": "Spring 2020",
      "institution": "Virginia Tech",
      "start_date": "2020-01-20",
      "end_date": "2020-05-06",
      "academic_level": "Undergraduate",
      "primary_college": "Engineering",
      "primary_major": "CPE - Computer Engineering",
      "academic_standing": "Good Standing",
      "attempt_hours": 15.0,
      "passed_hours": 15.0,
      "earned_hours": 15.0,
      "gpa_hours": 12.0,
      "quality_points": 36.0,
      "term_gpa": 3.0,
      "cumulative_gpa": 2.95,
      "classes": [
        {
          "subject": "ECE",
          "course": "2214",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Physical Electronics",
          "grade": "C+",
          "credit_hours": 3.0,
          "quality_points": 6.9,
          "tag": "Computer Engineering"
        },
        {
          "subject": "ECE",
          "course": "2544",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Fundamentals Digital Systems",
          "grade": "A-",
          "credit_hours": 3.0,
          "quality_points": 11.1,
          "tag": "Computer Engineering"
        },
        {
          "subject": "MATH",
          "course": "3144",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Linear Algebra I",
          "grade": "B-",
          "credit_hours": 3.0,
          "quality_points": 8.1,
          "tag": "Mathematics"
        },
        {
          "subject": "MATH",
          "course": "4445",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Intro to Numer Analysis",
          "grade": "B+",
          "credit_hours": 3.0,
          "quality_points": 9.9,
          "tag": "Mathematics"
        },
        {
          "subject": "STAT",
          "course": "4714",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Prob & Stat for EE",
          "grade": "CC",
          "credit_hours": 3.0,
          "quality_points": 0.0,
          "tag": "Mathematics"
        }
      ]
    },
    {
      "semester_name": "Summer 2020",
      "term_code": "Summer 2020",
      "institution": "Virginia Tech",
      "start_date": "2020-05-27",
      "end_date": "2020-08-15",
      "academic_level": "Undergraduate",
      "primary_college": "Engineering",
      "primary_major": "CPE - Computer Engineering",
      "academic_standing": "Good Standing",
      "attempt_hours": 8.0,
      "passed_hours": 8.0,
      "earned_hours": 8.0,
      "gpa_hours": 8.0,
      "quality_points": 26.1,
      "term_gpa": 3.26,
      "cumulative_gpa": 3.01,
      "classes": [
        {
          "subject": "ECE",
          "course": "2564",
          "campus": "Virtual",
          "level": "UG",
          "title": "Embedded Systems",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Computer Engineering"
        },
        {
          "subject": "ECE",
          "course": "2714",
          "campus": "Virtual",
          "level": "UG",
          "title": "Signals and Systems",
          "grade": "B-",
          "credit_hours": 3.0,
          "quality_points": 8.1,
          "tag": "Computer Engineering"
        },
        {
          "subject": "ECE",
          "course": "2804",
          "campus": "Virtual",
          "level": "UG",
          "title": "Integrated Design Project",
          "grade": "B",
          "credit_hours": 2.0,
          "quality_points": 6.0,
          "tag": "Computer Engineering"
        }
      ]
    },
    {
      "semester_name": "Fall 2020",
      "term_code": "Fall 2020",
      "institution": "Virginia Tech",
      "start_date": "2020-08-25",
      "end_date": "2020-12-10",
      "academic_level": "Undergraduate",
      "primary_college": "Engineering",
      "primary_major": "MCHL - Machine Learning",
      "academic_standing": "Good Standing",
      "attempt_hours": 16.0,
      "passed_hours": 16.0,
      "earned_hours": 16.0,
      "gpa_hours": 16.0,
      "quality_points": 51.0,
      "term_gpa": 3.18,
      "cumulative_gpa": 3.06,
      "classes": [
        {
          "subject": "ECE",
          "course": "2500",
          "campus": "Virtual",
          "level": "UG",
          "title": "Computer Org & Architecture",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Computer Engineering"
        },
        {
          "subject": "ECE",
          "course": "2574",
          "campus": "Virtual",
          "level": "UG",
          "title": "Data Structures and Algorithms",
          "grade": "B",
          "credit_hours": 3.0,
          "quality_points": 9.0,
          "tag": "Computer Science"
        },
        {
          "subject": "ECE",
          "course": "3544",
          "campus": "Virtual",
          "level": "UG",
          "title": "Digital Design I",
          "grade": "B",
          "credit_hours": 4.0,
          "quality_points": 12.0,
          "tag": "Computer Engineering"
        },
        {
          "subject": "ECE",
          "course": "4580",
          "campus": "Virtual",
          "level": "UG",
          "title": "Digital Image Processing",
          "grade": "B",
          "credit_hours": 3.0,
          "quality_points": 9.0,
          "tag": "Machine Learning"
        },
        {
          "subject": "SPAN",
          "course": "1105",
          "campus": "Virtual",
          "level": "UG",
          "title": "Elementary Spanish",
          "grade": "B",
          "credit_hours": 3.0,
          "quality_points": 9.0,
          "tag": "Pathways"
        }
      ]
    },
    {
      "semester_name": "Spring 2021",
      "term_code": "Spring 2021",
      "institution": "Virginia Tech",
      "start_date": "2021-01-20",
      "end_date": "2021-05-06",
      "academic_level": "Undergraduate",
      "primary_college": "Engineering",
      "primary_major": "MCHL - Machine Learning",
      "academic_standing": "Good Standing",
      "attempt_hours": 16.0,
      "passed_hours": 16.0,
      "earned_hours": 16.0,
      "gpa_hours": 16.0,
      "quality_points": 48.9,
      "term_gpa": 3.05,
      "cumulative_gpa": 3.06,
      "classes": [
        {
          "subject": "ECE",
          "course": "3574",
          "campus": "Virtual",
          "level": "UG",
          "title": "Applied Software Design",
          "grade": "A-",
          "credit_hours": 3.0,
          "quality_points": 11.1,
          "tag": "Computer Science"
        },
        {
          "subject": "ECE",
          "course": "4524",
          "campus": "Virtual",
          "level": "UG",
          "title": "Artif Intellig and Engr Appl",
          "grade": "B",
          "credit_hours": 4.0,
          "quality_points": 12.0,
          "tag": "Machine Learning"
        },
        {
          "subject": "ECE",
          "course": "4805",
          "campus": "Virtual",
          "level": "UG",
          "title": "Senior Design Project",
          "grade": "B",
          "credit_hours": 3.0,
          "quality_points": 9.0,
          "tag": "Computer Engineering"
        },
        {
          "subject": "MATH",
          "course": "3124",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Modern Algebra",
          "grade": "B+",
          "credit_hours": 3.0,
          "quality_points": 9.9,
          "tag": "Mathematics"
        },
        {
          "subject": "SPAN",
          "course": "1106",
          "campus": "Virtual",
          "level": "UG",
          "title": "Elementary Spanish",
          "grade": "C+",
          "credit_hours": 3.0,
          "quality_points": 6.9,
          "tag": "Pathways"
        }
      ]
    },
    {
      "semester_name": "Fall 2021",
      "term_code": "Fall 2021",
      "institution": "Virginia Tech",
      "start_date": "2021-08-25",
      "end_date": "2021-12-10",
      "academic_level": "Undergraduate",
      "primary_college": "Engineering",
      "primary_major": "MCHL - Machine Learning",
      "academic_standing": "Good Standing",
      "attempt_hours": 18.0,
      "passed_hours": 18.0,
      "earned_hours": 18.0,
      "gpa_hours": 18.0,
      "quality_points": 53.1,
      "term_gpa": 2.95,
      "cumulative_gpa": 3.03,
      "classes": [
        {
          "subject": "ECE",
          "course": "4424",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Machine Learning",
          "grade": "C-",
          "credit_hours": 3.0,
          "quality_points": 5.1,
          "tag": "Machine Learning"
        },
        {
          "subject": "ECE",
          "course": "4554",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Intro to Computer Vision",
          "grade": "D",
          "credit_hours": 3.0,
          "quality_points": 3.0,
          "tag": "Machine Learning"
        },
        {
          "subject": "ECE",
          "course": "4806",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Senior Design Project",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Computer Engineering"
        },
        {
          "subject": "MATH",
          "course": "3214",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Calculus of Several Variables",
          "grade": "A-",
          "credit_hours": 3.0,
          "quality_points": 11.1,
          "tag": "Mathematics"
        },
        {
          "subject": "MATH",
          "course": "4176",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Cryptography",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Mathematics"
        },
        {
          "subject": "MATH",
          "course": "4984",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "SS: Introduction to Manifolds",
          "grade": "B+",
          "credit_hours": 3.0,
          "quality_points": 9.9,
          "tag": "Mathematics"
        }
      ]
    },
    {
      "semester_name": "Spring 2022",
      "term_code": "Spring 2022",
      "institution": "Virginia Tech",
      "start_date": "2022-01-20",
      "end_date": "2022-05-06",
      "academic_level": "Undergraduate",
      "primary_college": "Engineering",
      "primary_major": "MCHL - Machine Learning",
      "academic_standing": "Good Standing",
      "attempt_hours": 18.0,
      "passed_hours": 18.0,
      "earned_hours": 18.0,
      "gpa_hours": 18.0,
      "quality_points": 54.0,
      "term_gpa": 3.0,
      "cumulative_gpa": 3.03,
      "classes": [
        {
          "subject": "MATH",
          "course": "3224",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Advanced Calculus",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Mathematics"
        },
        {
          "subject": "MATH",
          "course": "4144",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Linear Algebra II",
          "grade": "B+",
          "credit_hours": 3.0,
          "quality_points": 9.9,
          "tag": "Mathematics"
        },
        {
          "subject": "MATH",
          "course": "4226",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Elementary Real Analysis",
          "grade": "C",
          "credit_hours": 3.0,
          "quality_points": 6.0,
          "tag": "Mathematics"
        },
        {
          "subject": "MATH",
          "course": "4324",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Elementary Topology",
          "grade": "B",
          "credit_hours": 3.0,
          "quality_points": 9.0,
          "tag": "Mathematics"
        },
        {
          "subject": "MATH",
          "course": "4414",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Issues in Scientific Computing",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Computer Science"
        },
        {
          "subject": "MATH",
          "course": "5524",
          "campus": "Blacksburg",
          "level": "UG",
          "title": "Matrix Theory",
          "grade": "C-",
          "credit_hours": 3.0,
          "quality_points": 5.1,
          "tag": "Mathematics"
        }
      ]
    },
    {
      "semester_name": "Fall 2022",
      "term_code": "Fall 2022",
      "institution": "Virginia Tech",
      "start_date": "2022-08-25",
      "end_date": "2022-12-10",
      "academic_level": "Graduate",
      "primary_college": "Engineering",
      "primary_major": "CPE - Computer Engineering",
      "academic_standing": "Graduate Program Probation",
      "attempt_hours": 13.0,
      "passed_hours": 10.0,
      "earned_hours": 10.0,
      "gpa_hours": 9.0,
      "quality_points": 24.0,
      "term_gpa": 2.66,
      "cumulative_gpa": 2.66,
      "classes": [
        {
          "subject": "ECE",
          "course": "5510",
          "campus": "Blacksburg",
          "level": "GR",
          "title": "Multiprocessor Programming",
          "grade": "WG",
          "credit_hours": 3.0,
          "quality_points": 0.0,
          "tag": "Computer Science"
        },
        {
          "subject": "ECE",
          "course": "5944",
          "campus": "Blacksburg",
          "level": "GR",
          "title": "Seminar",
          "grade": "P",
          "credit_hours": 1.0,
          "quality_points": 0.0,
          "tag": "Computer Engineering"
        },
        {
          "subject": "ECE",
          "course": "6554",
          "campus": "Blacksburg",
          "level": "GR",
          "title": "Advanced Computer Vision",
          "grade": "B",
          "credit_hours": 3.0,
          "quality_points": 9.0,
          "tag": "Machine Learning"
        },
        {
          "subject": "MATH",
          "course": "5344",
          "campus": "Blacksburg",
          "level": "GR",
          "title": "TS: Algebraic Topology",
          "grade": "D",
          "credit_hours": 3.0,
          "quality_points": 3.0,
          "tag": "Mathematics"
        },
        {
          "subject": "MATH",
          "course": "5485",
          "campus": "Blacksburg",
          "level": "GR",
          "title": "Numer Analy and Softw",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Mathematics"
        }
      ]
    },
    {
      "semester_name": "Fall 2023",
      "term_code": "Fall 2023",
      "institution": "Virginia Tech",
      "start_date": "2023-08-25",
      "end_date": "2023-12-10",
      "academic_level": "Graduate",
      "primary_college": "Engineering",
      "primary_major": "CPE - Computer Engineering",
      "academic_standing": "Graduate Program Probation",
      "attempt_hours": 9.0,
      "passed_hours": 6.0,
      "earned_hours": 6.0,
      "gpa_hours": 6.0,
      "quality_points": 17.1,
      "term_gpa": 2.85,
      "cumulative_gpa": 2.74,
      "classes": [
        {
          "subject": "CS",
          "course": "5114",
          "campus": "Blacksburg",
          "level": "GR",
          "title": "Theory of Algorithms",
          "grade": "B",
          "credit_hours": 3.0,
          "quality_points": 9.0,
          "tag": "Computer Science"
        },
        {
          "subject": "ECE",
          "course": "5984",
          "campus": "Virtual",
          "level": "GR",
          "title": "SS: Brain-inspired Comp Arch",
          "grade": "B-",
          "credit_hours": 3.0,
          "quality_points": 8.1,
          "tag": "Machine Learning"
        },
        {
          "subject": "ECE",
          "course": "5984",
          "campus": "Blacksburg",
          "level": "GR",
          "title": "SS: Reinforcement Learning",
          "grade": "WG",
          "credit_hours": 3.0,
          "quality_points": 0.0,
          "tag": "Machine Learning"
        }
      ]
    },
    {
      "semester_name": "Fall 2024",
      "term_code": "Fall 2024",
      "institution": "Virginia Tech",
      "start_date": "2024-08-25",
      "end_date": "2024-12-10",
      "academic_level": "Graduate",
      "primary_college": "Engineering",
      "primary_major": "CPE - Computer Engineering",
      "academic_standing": "Graduate Program Probation",
      "attempt_hours": 9.0,
      "passed_hours": 6.0,
      "earned_hours": 6.0,
      "gpa_hours": 3.0,
      "quality_points": 11.1,
      "term_gpa": 3.7,
      "cumulative_gpa": 2.9,
      "classes": [
        {
          "subject": "ECE",
          "course": "5424",
          "campus": "Virtual",
          "level": "GR",
          "title": "Advanced Machine Learning",
          "grade": "A-",
          "credit_hours": 3.0,
          "quality_points": 11.1,
          "tag": "Machine Learning"
        },
        {
          "subject": "ECE",
          "course": "5744",
          "campus": "Blacksburg",
          "level": "GR",
          "title": "Linear Systems Theory",
          "grade": "WG",
          "credit_hours": 3.0,
          "quality_points": 0.0,
          "tag": "Computer Engineering"
        },
        {
          "subject": "ECE",
          "course": "5994",
          "campus": "Blacksburg",
          "level": "GR",
          "title": "Research and Thesis",
          "grade": "EQ",
          "credit_hours": 3.0,
          "quality_points": 0.0,
          "tag": "Computer Engineering"
        }
      ]
    },
    {
      "semester_name": "Spring 2025",
      "term_code": "Spring 2025",
      "institution": "Virginia Tech",
      "start_date": "2025-01-20",
      "end_date": "2025-05-06",
      "academic_level": "Graduate",
      "primary_college": "Engineering",
      "primary_major": "CPE - Computer Engineering",
      "academic_standing": "Good Standing",
      "attempt_hours": 11.0,
      "passed_hours": 11.0,
      "earned_hours": 11.0,
      "gpa_hours": 9.0,
      "quality_points": 32.1,
      "term_gpa": 3.56,
      "cumulative_gpa": 3.12,
      "classes": [
        {
          "subject": "CS",
          "course": "5624",
          "campus": "Blacksburg",
          "level": "GR",
          "title": "Natural Language Processing",
          "grade": "A",
          "credit_hours": 3.0,
          "quality_points": 12.0,
          "tag": "Machine Learning"
        },
        {
          "subject": "ECE",
          "course": "5944",
          "campus": "Blacksburg",
          "level": "GR",
          "title": "Seminar",
          "grade": "P",
          "credit_hours": 1.0,
          "quality_points": 0.0,
          "tag": "Computer Engineering"
        },
        {
          "subject": "ECE",
          "course": "6474",
          "campus": "Virtual",
          "level": "GR",
          "title": "Deep Reinforcement Learning",
          "grade": "A-",
          "credit_hours": 3.0,
          "quality_points": 11.1,
          "tag": "Machine Learning"
        },
        {
          "subject": "ECE",
          "course": "6524",
          "campus": "Virtual",
          "level": "GR",
          "title": "Deep Learning",
          "grade": "B",
          "credit_hours": 3.0,
          "quality_points": 9.0,
          "tag": "Machine Learning"
        },
        {
          "subject": "ENGE",
          "course": "5304",
          "campus": "Virtual",
          "level": "GR",
          "title": "Grad Stud Succ Multicult Envir",
          "grade": "P",
          "credit_hours": 1.0,
          "quality_points": 0.0,
          "tag": "Pathways"
        }
      ]
    },
    {
      "semester_name": "Summer 2025",
      "term_code": "Summer 2025",
      "institution": "Virginia Tech",
      "start_date": "2025-05-27",
      "end_date": "2025-08-15",
      "academic_level": "Graduate",
      "primary_college": "Engineering",
      "primary_major": "CPE - Computer Engineering",
      "academic_standing": "Good Standing",
      "attempt_hours": 3.0,
      "passed_hours": 3.0,
      "earned_hours": 3.0,
      "gpa_hours": 3.0,
      "quality_points": 11.1,
      "term_gpa": 3.7,
      "cumulative_gpa": 3.18,
      "classes": [
        {
          "subject": "CS",
          "course": "5764",
          "campus": "Virtual",
          "level": "GR",
          "title": "Information Visualization",
          "grade": "A-",
          "credit_hours": 3.0,
          "quality_points": 11.1,
          "tag": "Computer Science"
        }
      ]
    }
  ]
