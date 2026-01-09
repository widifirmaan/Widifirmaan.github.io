package com.widifirmaan.porto.controller;

import com.widifirmaan.porto.model.Project;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ProjectController {

    @GetMapping("/api/projects")
    public List<Project> getProjects() {
        List<Project> projects = new ArrayList<>();

        // 1. School Games
        projects.add(new Project(1L,
            "BukuMedia Games (Next.js)",
            "Proyek ini adalah platform pembelajaran interaktif berbasis web yang dibangun dengan Next.js. Aplikasi ini menyediakan serangkaian permainan edukatif (level) yang dirancang untuk membantu siswa dalam pembelajaran dan refleksi diri.",
            "https://bukudigitalamal.vercel.app/",
            "https://github.com/widifirmaan/nextjs-school-games",
            List.of("assets/img/porto/schoolgames_1.png", "assets/img/porto/schoolgames_2.png", "assets/img/porto/schoolgames_3.png", "assets/img/porto/schoolgames_4.png"),
            List.of("Sistem Level (30 level interaktif)", "Dashboard Siswa (track progress)", "Dashboard Guru (monitor activity)", "Export Data (Excel format)", "Responsive Design"),
            List.of("Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Java"),
            "MongoDB"
        ));

        // 2. Springboot POS
        projects.add(new Project(2L,
            "Simple POS for UMKM (Springboot)",
            "A comprehensive Point of Sales (POS) system designed to streamline day-to-day operations for small to medium-sized electronics retailers (UMKM). This application handles inventory, sales transactions, financial reporting, and billing management.",
            "https://pos.widifirmaan.web.id",
            "https://github.com/widifirmaan/Springboot-Simple-POS",
            List.of("assets/img/porto/pos_1.png", "assets/img/porto/pos_2.png", "assets/img/porto/pos_3.png", "assets/img/porto/pos_4.png"),
            List.of("Stock Management", "Finance & Transactions", "Billing & Invoicing", "Pricing & Export (Receipt Printing)"),
            List.of("Java 17+", "Spring Boot 3.2.4", "MongoDB", "Thymeleaf", "HTML5", "Bootstrap 5"),
            "MongoDB"
        ));

        // 3. Siap Nyafe
        projects.add(new Project(3L,
            "Siap Nyafe - Coffee Shop POS (Spring Boot + React)",
            "A state-of-the-art, web-based Point of Sale (POS) and Management System designed specifically for modern coffee shops. It features a distinctive Neo-Brutalist design language, Kitchen Display System (KDS), and comprehensive management tools.",
            "https://nyafe.widifirmaan.web.id/",
            "https://github.com/widifirmaan/Springboot-React-CoffeeShopManagement",
            List.of("assets/img/porto/coffee_2.png", "assets/img/porto/coffee_1.png", "assets/img/porto/coffee_3.png", "assets/img/porto/coffee_4.png"),
            List.of("Visual Menu & Smart Cart", "Kitchen Display System (KDS)", "Real-time Workflow", "Inventory & Stock Management", "Finance & Reports", "Employee Management", "Neo-Brutalist Design"),
            List.of("Java 21", "Spring Boot 3.2", "React.js 18", "MongoDB", "Vite", "CSS Modules"),
            "MongoDB"
        ));

        // 4. DUFL Tools
        projects.add(new Project(4L,
            "DUFL Tools - Lightweight AIO Tools (Bootstrap)",
            "A collection of free, lightweight online tools built with HTML, CSS, JavaScript, and PHP. This project is designed to be highly efficient, running primarily on client-side technology to minimize server load, wrapped in an optimized Docker container.",
            "https://tools.dufl.web.id",
            "https://github.com/widifirmaan/JavaScript-AIO-Tools",
            List.of("assets/img/porto/jsaio_1.png"),
            List.of("Image Compressor (client-side)", "PDF to Word Converter", "Background Remover (Edge AI)", "Scientific Calculator", "Image Converter", "Text Editor", "Client-Side AI"),
            List.of("HTML", "CSS", "JavaScript", "PHP", "Docker", "WebAssembly"),
            "None"
        ));

        // 5. ExcelPintar
        projects.add(new Project(5L, 
            "ExcelPintar Media Pembelajaran (Bootstrap)", 
            "ExcelPintar adalah aplikasi media pembelajaran berbasis web yang dirancang untuk membantu siswa memahami dasar-dasar pengoperasian Microsoft Excel. Aplikasi ini menyajikan materi secara interaktif, lengkap dengan video, latihan soal, dan kuis evaluasi.",
            "https://widifirmaan.github.io/ExcelPintar-Media-Pembelajaran/",
            "https://github.com/widifirmaan/ExcelPintar-Media-Pembelajaran",
            List.of("assets/img/porto/excelpintar_1.png", "assets/img/porto/excelpintar_2.png", "assets/img/porto/excelpintar_3.png", "assets/img/porto/excelpintar_4.png"),
            List.of("Halaman Utama (Landing Page)", "Kompetensi Dasar (KD)", "Materi Pembelajaran", "Latihan Soal", "Quiz Interaktif", "Profil Pengembang", "Daftar Pustaka"),
            List.of("JavaScript", "HTML", "Smarty", "CSS"),
            "None"
        ));

        // 6. Portograph
        projects.add(new Project(6L,
            "Portograph Wedding Portfolio Template (HTML5)",
            "Portograph is a premium, lightweight, and high-performance website template designed specifically for wedding cinematic services, photographers, and videographers. It features a modern, clean aesthetics with fluid animations to showcase your portfolio in the best light.",
            "https://widifirmaan.github.io/Portograph-Template/",
            "https://github.com/widifirmaan/Portograph-Template",
            List.of("assets/img/porto/portograph_1.png", "assets/img/porto/portograph_2.png", "assets/img/porto/portograph_3.png"),
            List.of("Super Lightweight & Fast", "Fully Responsive", "Fluid Animations", "Gallery & Portfolio", "Instagram Integration", "Services & Pricing"),
            List.of("HTML5", "CSS3", "JavaScript", "Vanilla JS", "PHP"),
            "None"
        ));

        // 7. Restaurant WP
        projects.add(new Project(7L,
            "GKSteak Web (Wordpress)",
            "Project ini adalah arsip website lama GKSteak yang telah dihidupkan kembali (revived). Saya mencoba memulihkan website ini dari file backup lawas dan mengemasnya ke dalam environment Docker.",
            "https://restaurant.widifirmaan.web.id",
            "https://github.com/widifirmaan/Wordpress-Docker-Restaurant",
            List.of("assets/img/porto/restaurant_1.png", "assets/img/porto/restaurant_2.png", "assets/img/porto/restaurant_3.png"),
            List.of("Archive Restoration (revived from backup)", "Dockerized Environment", "Plug & Play Deployment", "Automated Database Import (init.sql)"),
            List.of("WordPress", "MariaDB", "Docker", "PHP", "JavaScript", "CSS"),
            "MySQL"
        ));

        // 8. Angplov
        projects.add(new Project(8L,
            "Angplov Undangan Digital (Wordpress)",
            "Proyek ini adalah platform berbasis WordPress untuk membuat undangan pernikahan digital, yang telah dikemas menggunakan Docker untuk kemudahan deployment dan pengembangan.",
            "https://undangan.widifirmaan.web.id",
            "https://github.com/widifirmaan/Angplov-Undangan-Digital",
            List.of("assets/img/porto/angplov_1.png", "assets/img/porto/angplov_2.png", "assets/img/porto/angplov_3.png"),
            List.of("Lingkungan Docker (terisolasi dan konsisten)", "Ringan (konfigurasi dioptimalkan)", "Auto-Config (Database otomatis)"),
            List.of("WordPress", "Docker", "MariaDB 10", "Apache", "PHP 8.x", "JavaScript"),
            "MySQL"
        ));

        // 9. Omah Sampah
        projects.add(new Project(9L,
            "Omah Sampah (PHP)(Dead)",
            "Dashboard Trash Management System, built with PHP. This project makes it easier to manage waste collection and maggot management online.",
            "#",
            "#", // Repo deleted
            List.of("assets/img/porto/omahsampah.png"),
            List.of("Dashboard for Trash and Maggot Management", "Trash and Maggot Pickup", "Transaction and Bill Management", "User with Role Management", "All Report"),
            List.of("PHP", "HTML", "CSS", "JavaScript", "MySQL"),
            "MySQL"
        ));

        return projects;
    }
}
