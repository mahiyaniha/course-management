package com.course_management.project.service;

import com.course_management.project.dto.*;
import com.course_management.project.modal.*;
import com.course_management.project.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class StudentService {

    final private CourseSectionRepository sectionRepository;
    final private EnrollmentRepository enrollmentRepository;
    final private CourseRepository courseRepository;
    final private CompletedCourseRepository completedCourseRepository;
    final private SemesterRepository semesterRepository;
    final private EnrollmentRequestRepository enrollmentRequestRepository;
    final private StudentRepository studentRepository;

    public StudentService(CourseSectionRepository sectionRepository, EnrollmentRepository enrollmentRepository, CourseRepository courseRepository, CompletedCourseRepository completedCourseRepository, SemesterRepository semesterRepository, EnrollmentRequestRepository enrollmentRequestRepository, StudentRepository studentRepository) {
        this.sectionRepository = sectionRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.completedCourseRepository = completedCourseRepository;
        this.semesterRepository = semesterRepository;
        this.enrollmentRequestRepository = enrollmentRequestRepository;
        this.studentRepository = studentRepository;
    }


    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Integer id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public String updateStudentProfile(StudentDTO dto, MultipartFile photo) throws IOException {
        Student student = studentRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // update fields from DTO
        student.getUser().setEmail(dto.getEmail());
        student.getUser().setFirstName(dto.getFirstName());
        student.getUser().setLastName(dto.getLastName());
        student.setDescription(dto.getDescription());
        student.setAddress(dto.getAddress());
        student.setPhone(dto.getPhone());

        // convert image → BLOB
        if (photo != null && !photo.isEmpty()) {
            student.setPicture(photo.getBytes());
        }
        studentRepository.save(student);
        return "Profile updated successfully";
    }

    // 📊 DASHBOARD (FINAL)
    public DashboardDTO getDashboard(Integer studentId) {
        int totalCourses = enrollmentRepository.findByStudentId(studentId).size();

        Integer totalCredits = enrollmentRepository.getTotalCredits(studentId);
        int safeCredits = (totalCredits == null) ? 0 : totalCredits;

        List<CompletedCourse> completedList =
                completedCourseRepository.findByIdStudentId(studentId);

        int completedCourses = completedList.size();

        int completedCredits = completedList.stream()
                .mapToInt(c -> courseRepository.findById(c.getId().getCourseId())
                        .orElseThrow()
                        .getCredit())
                .sum();

        double completionRate = (totalCourses == 0)
                ? 0
                : ((double) completedCourses / totalCourses) * 100;

        Semester activeSemester = semesterRepository.findByActive(1);

        double cgpa = getCGPA(studentId);

        return DashboardDTO.builder()
                .totalCourses(totalCourses)
                .totalCredits(safeCredits)
                .completedCourses(completedCourses)
                .completedCredits(completedCredits)
                .completionRate(completionRate)
                .activeSemester(activeSemester != null ? activeSemester.getName() : null)
                .cgpa(cgpa)
                .build();
    }

    // 📚 AVAILABLE COURSES
    public List<CourseSection> getAvailableCourses() {
        return sectionRepository.findAll();
    }

    // 🔥 ADD COURSE REQUEST
    public String addCourse(EnrollmentRequestDTO dto) {
        EnrollmentRequest enrollmentRequest = new EnrollmentRequest();
        enrollmentRequest.getStudent().setId(dto.getStudentId());
        enrollmentRequest.getCourse().setId(dto.getCourseId());

        enrollmentRequest.setStatus(EnrollmentRequest.Status.PENDING);
        enrollmentRequestRepository.save(enrollmentRequest);

        return "Request submitted";
    }

    public  List<Enrollment> getEnrollments(Integer userId) {
        return enrollmentRepository.findByStudentId(userId);
    }
    public  List<EnrollmentRequest> getEnrollmentRequests(Integer userId) {
        return enrollmentRequestRepository.findByStudent_Id(userId);
    }


    public List<MyCourseDTO> myCourses(Integer studentId) {
        return enrollmentRepository.findByStudentId(studentId)
                .stream()
                .map(e -> {

                    CourseSection section = sectionRepository.findById(e.getSection().getId())
                            .orElseThrow();

                    MyCourseDTO dto = new MyCourseDTO();

                    dto.setSectionId(section.getId());
                    dto.setCourseId(section.getCourse().getId());

                    courseRepository.findById(section.getCourse().getId()).ifPresent(course -> {
                        dto.setCourseName(course.getTitle());
                        dto.setCredit(course.getCredit());
                    });

                    return dto;
                }).toList();
    }

    // 🆕 COMPLETED COURSES
    public List<MyCourseDTO> getCompletedCourses(Integer studentId) {

        return completedCourseRepository.findByIdStudentId(studentId)
                .stream()
                .map(c -> {

                    MyCourseDTO dto = new MyCourseDTO();

                    Integer courseId = c.getId().getCourseId();
                    dto.setCourseId(courseId);

                    courseRepository.findById(courseId).ifPresent(course -> {
                        dto.setCourseName(course.getTitle());
                        dto.setCredit(course.getCredit());
                    });

                    dto.setGrade(c.getGrade());

                    if (c.getCompletedAt() != null) {
                        dto.setCompletedAt(c.getCompletedAt().toString());
                    }

                    return dto;
                }).toList();
    }

    // 🗓️ SCHEDULE
    public List<CourseSection> getSchedule(Integer studentId) {
        return enrollmentRepository.findByStudentId(studentId)
                .stream()
                .map(e -> sectionRepository.findById(e.getSection().getId())
                        .orElseThrow())
                .toList();
    }

    // 📊 GRADE DISTRIBUTION
    public GradeDistributionDTO getGradeDistribution(Integer studentId) {
        Integer student_id = getStudentById(studentId).getId();
        List<CompletedCourse> list =
                completedCourseRepository.findByIdStudentId(student_id);

        int aPlus = 0, a = 0, aMinus = 0, bPlus = 0, b = 0, c = 0, d = 0;

        for (CompletedCourse cc : list) {

            String grade = cc.getGrade();
            if (grade == null) continue;

            switch (grade) {
                case "A+" -> aPlus++;
                case "A"  -> a++;
                case "A-" -> aMinus++;
                case "B+" -> bPlus++;
                case "B"  -> b++;
                case "C"  -> c++;
                case "D"  -> d++;
            }
        }

        return GradeDistributionDTO.builder()
                .aPlus(aPlus)
                .a(a)
                .aMinus(aMinus)
                .bPlus(bPlus)
                .b(b)
                .c(c)
                .d(d)
                .build();
    }

    // ⭐ CGPA LOGIC
    private double getGradePoint(String grade) {

        if (grade == null) return 0;

        return switch (grade) {
            case "A+" -> 4.00;
            case "A"  -> 3.75;
            case "A-" -> 3.50;
            case "B+" -> 3.25;
            case "B"  -> 3.00;
            case "C"  -> 2.50;
            case "D"  -> 2.00;
            default   -> 0.00;
        };
    }

    public double getCGPA(Integer studentId) {
        List<CompletedCourse> list =
                completedCourseRepository.findByIdStudentId(studentId);

        if (list.isEmpty()) return 0.0;

        double totalPoints = 0;

        for (CompletedCourse c : list) {
            totalPoints += getGradePoint(c.getGrade());
        }

        return totalPoints / list.size();
    }
}