package com.course_management.project.service;

import com.course_management.project.dto.*;
import com.course_management.project.modal.*;
import com.course_management.project.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
public class StudentService {

    final private CourseSectionRepository sectionRepository;
    final private EnrollmentRepository enrollmentRepository;
    final private CourseRepository courseRepository;
    final private CompletedCourseRepository completedCourseRepository;
    final private SemesterRepository semesterRepository;
    final private StudentRepository studentRepository;
    private final EnrollmentService enrollmentService;
    private final CourseService courseService;

    public StudentService(CourseSectionRepository sectionRepository, EnrollmentRepository enrollmentRepository, CourseRepository courseRepository, CompletedCourseRepository completedCourseRepository, SemesterRepository semesterRepository, StudentRepository studentRepository, EnrollmentService enrollmentService, CourseService courseService) {
        this.sectionRepository = sectionRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.completedCourseRepository = completedCourseRepository;
        this.semesterRepository = semesterRepository;
        this.studentRepository = studentRepository;
        this.enrollmentService = enrollmentService;
        this.courseService = courseService;
    }


    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Integer id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }
    public Student getStudentByUserId(Integer id) {
        return studentRepository.findByUserId(id)
                .orElseThrow(() -> new RuntimeException("Student with userId not found"));
    }

    public Map<String, Integer> getStudentCredits(Integer id) {
        Student studentByUserId = getStudentByUserId(id);
        Map<String, Integer> map = new HashMap<>();
        map.put("creditCompleted", studentByUserId.getCreditCompleted());
        map.put("maxCreditLimit", studentByUserId.getDepartment().getCredits());
        return map;
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
    public DashboardDTO getDashboard(Integer userId) {
        int totalCourses = enrollmentRepository.findByStudent_User_Id(userId).size();

        Integer totalCredits = enrollmentRepository.getTotalCredits(userId);
        int safeCredits = (totalCredits == null) ? 0 : totalCredits;

        List<CompletedCourse> completedList =
                completedCourseRepository.findByUserId(userId);

        int completedCourses = completedList.size();

        int completedCredits = completedList.stream()
                .mapToInt(c -> courseRepository.findById(c.getCourse().getId())
                        .orElseThrow()
                        .getCredit())
                .sum();

        double completionRate = (totalCourses == 0)
                ? 0
                : ((double) completedCourses / totalCourses) * 100;

        Semester activeSemester = semesterRepository.findByActive(1);

        double cgpa = getCGPA(userId);

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

    // Available courses including which failed to complete
    public List<CourseDTO> getAvailableCourses(Integer userId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollments(userId);

        // Map courseId -> enrollment
        Map<Integer, Enrollment> enrollmentMap = enrollments.stream()
                .collect(Collectors.toMap(
                        e -> e.getSection().getCourse().getId(),
                        e -> e
                ));

        List<Course> allCourses = courseService.getAllCourses();

        return allCourses.stream()
                .map(course -> {
                    CourseDTO dto = new CourseDTO();

                    dto.setId(course.getId());
                    dto.setCode(course.getCode());
                    dto.setTitle(course.getTitle());
                    dto.setCredit(course.getCredit());
                    dto.setDepartment(course.getDepartment());
                    dto.setAdvisor(course.getAdvisor());
                    dto.setAvailableSeat(course.getAvailableSeat());
                    dto.setTotalSeat(course.getTotalSeat());

                    Enrollment enrollment = enrollmentMap.get(course.getId());

                    if (enrollment == null) {
                        dto.setStatus("NOT_ENROLLED");
                    } else {
                        dto.setStatus(enrollment.getStatus().name());
                    }

                    return dto;
                })
                .toList();
    }

    // 🆕 COMPLETED COURSES
    public List<MyCourseDTO> getCompletedCourses(Integer studentId) {

        return completedCourseRepository.findByUserId(studentId)
                .stream()
                .map(c -> {

                    MyCourseDTO dto = new MyCourseDTO();

                    Integer courseId = c.getCourse().getId();
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
        return enrollmentRepository
                .findByStudent_User_IdAndStatus(studentId, Enrollment.Status.ACTIVE)
                .stream()
                .map(e -> sectionRepository.findById(e.getSection().getId())
                        .orElseThrow())
                .toList();
    }

    // 📊 GRADE DISTRIBUTION
    public GradeDistributionDTO getGradeDistribution(Integer userId) {
        Integer student_id = getStudentByUserId(userId).getId();
        List<CompletedCourse> list =
                completedCourseRepository.findByUserId(student_id);

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
                completedCourseRepository.findByUserId(studentId);

        if (list.isEmpty()) return 0.0;

        double totalPoints = 0;

        for (CompletedCourse c : list) {
            totalPoints += getGradePoint(c.getGrade());
        }

        return totalPoints / list.size();
    }

    public StudentAnalyticsDTO getStudentAnalytics(Integer userId) {
        Student student = getStudentByUserId(userId);
        Integer totalDeptCredits = student.getDepartment().getCredits();

        List<Enrollment> enrollments = enrollmentService.getEnrollments(userId);

        int totalActiveCredits = enrollments.stream()
                .filter(e -> e.getStatus() == Enrollment.Status.ACTIVE)
                .mapToInt(e -> e.getSection().getCourse().getCredit())
                .sum();


        int totalCompletedCredits = enrollments.stream()
                .filter(e -> e.getStatus() == Enrollment.Status.COMPLETED)
                .mapToInt(e -> e.getSection().getCourse().getCredit())
                .sum();

        Integer totalActiveCourses = enrollments.stream().filter(ele -> ele.getStatus().equals(Enrollment.Status.ACTIVE)).toList().size();
        Integer totalCompletedCourses = enrollments.stream().filter(ele -> ele.getStatus().equals(Enrollment.Status.COMPLETED)).toList().size();

        List<CompletedCourse> completedCourses = completedCourseRepository.findByUserId(student.getId());
        double totalCompletedGrades = completedCourses.stream().mapToDouble(ele -> Double.parseDouble(ele.getGrade())).sum();
        double totalAvgCgpa = totalCompletedGrades / completedCourses.size();

        StudentAnalyticsDTO studentAnalyticsDTO = new StudentAnalyticsDTO();
        studentAnalyticsDTO.setTotalDeptCredits(totalDeptCredits);
        studentAnalyticsDTO.setTotalActiveCredits(totalActiveCredits);
        studentAnalyticsDTO.setTotalCompletedCredits(totalCompletedCredits);
        studentAnalyticsDTO.setTotalActiveCourses(totalActiveCourses);
        studentAnalyticsDTO.setTotalCompletedCourses(totalCompletedCourses);
        studentAnalyticsDTO.setTotalAvgCgpa(totalAvgCgpa);

        return studentAnalyticsDTO;
    }

    public void addNewStudent(Student student) {
        studentRepository.save(student);
    }

    public Student updateStatus(Integer userId, String status) {
        Student student = getStudentByUserId(userId);
        student.setStatus(Student.Status.valueOf(status.toUpperCase()));
        return studentRepository.save(student);
    }
}