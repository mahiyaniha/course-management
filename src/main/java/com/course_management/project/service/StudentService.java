package com.course_management.project.service;

import com.course_management.project.dto.*;
import com.course_management.project.modal.*;
import com.course_management.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private CourseSectionRepository sectionRepo;

    @Autowired
    private EnrollmentRepository enrollRepo;

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private RequestRepository requestRepo;

    @Autowired
    private RequestItemRepository itemRepo;

    @Autowired
    private CompletedCourseRepository completedCourseRepo;

    @Autowired
    private SemesterRepository semesterRepo;

    @Autowired
    private EnrollmentRequestRepository enrollmentRequestRepository;

    @Autowired
    private StudentRepository studentRepository;


    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }


    public Student getStudentById(String uniqueId) {
        return studentRepository.findByUserUniqueId(uniqueId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public String updateStudentProfile(StudentDTO dto, MultipartFile photo) throws IOException {
        Student student = studentRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // update fields from DTO
        student.setEmail(dto.getEmail());
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setName(dto.getName());
        student.setDescription(dto.getDescription());
        student.setAddress(dto.getAddress());
        student.setPhone(dto.getPhone());
        student.setDepartment(dto.getDepartment());

        // convert image → BLOB
        if (photo != null && !photo.isEmpty()) {
            student.setPicture(photo.getBytes());
        }
        studentRepository.save(student);
        return "Profile updated successfully";
    }

    // 📊 DASHBOARD (FINAL)
    public DashboardDTO getDashboard(String studentId) {

        Student student = getStudentById(studentId);
        Integer student_id = student.getId();

        int totalCourses = enrollRepo.findByStudentId(student_id).size();

        Integer totalCredits = enrollRepo.getTotalCredits(student_id);
        int safeCredits = (totalCredits == null) ? 0 : totalCredits;

        List<CompletedCourse> completedList =
                completedCourseRepo.findByIdStudentId(student.getId());

        int completedCourses = completedList.size();

        int completedCredits = completedList.stream()
                .mapToInt(c -> courseRepo.findById(c.getId().getCourseId())
                        .orElseThrow()
                        .getCredit())
                .sum();

        double completionRate = (totalCourses == 0)
                ? 0
                : ((double) completedCourses / totalCourses) * 100;

        Semester activeSemester = semesterRepo.findByActive(1);

        double cgpa = getCGPA(student_id);

        return DashboardDTO.builder()
                .totalCourses(totalCourses)
                .totalCredits(safeCredits)
                .completedCourses(completedCourses)
                .completedCredits(completedCredits)
                .completionRate(completionRate)
                .pending(requestRepo.countByStudentIdAndStatus(student_id, "pending"))
                .approved(requestRepo.countByStudentIdAndStatus(student_id, "approved"))
                .activeSemester(activeSemester != null ? activeSemester.getName() : null)
                .cgpa(cgpa)
                .build();
    }

    // 📚 AVAILABLE COURSES
    public List<CourseSection> getAvailableCourses() {
        return sectionRepo.findAll();
    }

    // 🔥 ADD COURSE REQUEST
    public String addCourse(EnrollmentRequestDTO dto) {
        EnrollmentRequest enrollmentRequest = new EnrollmentRequest();
        enrollmentRequest.setStudentId(dto.getStudentId());
        enrollmentRequest.setCourseId(dto.getCourseId());
        enrollmentRequest.setAdvisorId(dto.getAdvisorId());
        enrollmentRequest.setStatus(dto.getStatus());
        enrollmentRequestRepository.save(enrollmentRequest);

        return "Request submitted";
    }

    public  List<Enrollment> getEnrollments(String uniqueId) {
        return enrollRepo.findByStudent_User_UniqueId(uniqueId);
    }
    // 📘 MY COURSES
    public List<MyCourseDTO> myCourses(String studentId) {
        Integer student_id = getStudentById(studentId).getId();

        return enrollRepo.findByStudentId(student_id)
                .stream()
                .map(e -> {

                    CourseSection section = sectionRepo.findById(e.getSection().getId())
                            .orElseThrow();

                    MyCourseDTO dto = new MyCourseDTO();

                    dto.setSectionId(section.getId());
                    dto.setCourseId(section.getCourse().getId());

                    courseRepo.findById(section.getCourse().getId()).ifPresent(course -> {
                        dto.setCourseName(course.getTitle());
                        dto.setCredit(course.getCredit());
                    });

                    return dto;
                }).toList();
    }

    // 🆕 COMPLETED COURSES
    public List<MyCourseDTO> getCompletedCourses(String studentId) {
        Integer student_id = getStudentById(studentId).getId();

        return completedCourseRepo.findByIdStudentId(student_id)
                .stream()
                .map(c -> {

                    MyCourseDTO dto = new MyCourseDTO();

                    Integer courseId = c.getId().getCourseId();
                    dto.setCourseId(courseId);

                    courseRepo.findById(courseId).ifPresent(course -> {
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
    public List<CourseSection> getSchedule(String studentId) {
        Integer student_id = getStudentById(studentId).getId();
        return enrollRepo.findByStudentId(student_id)
                .stream()
                .map(e -> sectionRepo.findById(e.getSection().getId())
                        .orElseThrow())
                .toList();
    }

    // 📜 REQUEST HISTORY
    public List<RegistrationRequest> getRequests(String studentId) {
        Integer student_id = getStudentById(studentId).getId();
        return requestRepo.findByStudentId(student_id);
    }

    // 📊 GRADE DISTRIBUTION
    public GradeDistributionDTO getGradeDistribution(String studentId) {
        Integer student_id = getStudentById(studentId).getId();
        List<CompletedCourse> list =
                completedCourseRepo.findByIdStudentId(student_id);

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
                completedCourseRepo.findByIdStudentId(studentId);

        if (list.isEmpty()) return 0.0;

        double totalPoints = 0;

        for (CompletedCourse c : list) {
            totalPoints += getGradePoint(c.getGrade());
        }

        return totalPoints / list.size();
    }
}