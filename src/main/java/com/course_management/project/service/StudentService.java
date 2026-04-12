package com.course_management.project.service;

import com.course_management.project.dto.*;
import com.course_management.project.modal.*;
import com.course_management.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    // 📊 DASHBOARD (FINAL)
    public DashboardDTO getDashboard(Integer studentId) {

        int totalCourses = enrollRepo.findByStudentId(studentId).size();

        Integer totalCredits = enrollRepo.getTotalCredits(studentId);
        int safeCredits = (totalCredits == null) ? 0 : totalCredits;

        List<CompletedCourse> completedList =
                completedCourseRepo.findByIdStudentId(studentId);

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

        double cgpa = getCGPA(studentId);

        return DashboardDTO.builder()
                .totalCourses(totalCourses)
                .totalCredits(safeCredits)
                .completedCourses(completedCourses)
                .completedCredits(completedCredits)
                .completionRate(completionRate)
                .pending(requestRepo.countByStudentIdAndStatus(studentId, "pending"))
                .approved(requestRepo.countByStudentIdAndStatus(studentId, "approved"))
                .activeSemester(activeSemester != null ? activeSemester.getName() : null)
                .cgpa(cgpa)
                .build();
    }

    // 📚 AVAILABLE COURSES
    public List<CourseSection> getAvailableCourses() {
        return sectionRepo.findAll();
    }

    // 🔥 ADD COURSE REQUEST
    public String addCourse(AddRequestDTO dto) {

        CourseSection section = sectionRepo.findById(dto.getSectionId())
                .orElseThrow(() -> new RuntimeException("Section not found"));

        if (section.getSeatTaken() >= section.getSeatLimit()) {
            throw new RuntimeException("No seats available");
        }

        List<Enrollment> enrollments = enrollRepo.findByStudentId(dto.getStudentId());

        for (Enrollment e : enrollments) {

            CourseSection s = sectionRepo.findById(e.getSectionId())
                    .orElseThrow();

            boolean clash =
                    s.getDay().equals(section.getDay()) &&
                            !(section.getEndTime().isBefore(s.getStartTime())
                                    || section.getStartTime().isAfter(s.getEndTime()));

            if (clash) {
                throw new RuntimeException("Time clash detected");
            }
        }

        Integer currentCredits = enrollRepo.getTotalCredits(dto.getStudentId());
        int safeCurrentCredits = (currentCredits == null) ? 0 : currentCredits;

        int newCredits = courseRepo.findById(section.getCourseId())
                .orElseThrow()
                .getCredit();

        if (safeCurrentCredits + newCredits > 18) {
            throw new RuntimeException("Credit limit exceeded");
        }

        RegistrationRequest req = new RegistrationRequest();
        req.setStudentId(dto.getStudentId());
        req.setStatus("pending");
        requestRepo.save(req);

        RegistrationRequestItem item = new RegistrationRequestItem();
        item.setRequestId(req.getId());
        item.setSectionId(section.getId());
        itemRepo.save(item);

        return "Request submitted";
    }

    // 📘 MY COURSES
    public List<MyCourseDTO> myCourses(Integer studentId) {

        return enrollRepo.findByStudentId(studentId)
                .stream()
                .map(e -> {

                    CourseSection section = sectionRepo.findById(e.getSectionId())
                            .orElseThrow();

                    MyCourseDTO dto = new MyCourseDTO();

                    dto.setSectionId(section.getId());
                    dto.setCourseId(section.getCourseId());

                    courseRepo.findById(section.getCourseId()).ifPresent(course -> {
                        dto.setCourseName(course.getTitle());
                        dto.setCredit(course.getCredit());
                    });

                    return dto;
                }).toList();
    }

    // 🆕 COMPLETED COURSES
    public List<MyCourseDTO> getCompletedCourses(Integer studentId) {

        return completedCourseRepo.findByIdStudentId(studentId)
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
    public List<CourseSection> getSchedule(Integer studentId) {
        return enrollRepo.findByStudentId(studentId)
                .stream()
                .map(e -> sectionRepo.findById(e.getSectionId())
                        .orElseThrow())
                .toList();
    }

    // 📜 REQUEST HISTORY
    public List<RegistrationRequest> getRequests(Integer studentId) {
        return requestRepo.findByStudentId(studentId);
    }

    // 📊 GRADE DISTRIBUTION
    public GradeDistributionDTO getGradeDistribution(Integer studentId) {

        List<CompletedCourse> list =
                completedCourseRepo.findByIdStudentId(studentId);

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