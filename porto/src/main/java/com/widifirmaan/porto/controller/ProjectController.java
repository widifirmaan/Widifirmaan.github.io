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
        projects.add(new Project(1L, "DUFL Tools", "All in One Useful tools.", "https://tools.dufl.web.id", "assets/img/porto/dufl-tools.png"));
        projects.add(new Project(2L, "Simple POS PHP", "Point of Sales with Barcode Scanner and Generator", "https://simplepos.dufl.web.id", "assets/img/porto/simple-pos.png"));
        projects.add(new Project(3L, "Omah Sampah", "Dashboard Trash Management System, built with PHP", "https://omahsampah.dufl.web.id", "assets/img/porto/omahsampah.png"));
        projects.add(new Project(4L, "Excel Pintar", "instructional Media with Quiz and Learning", "https://excelpintar.dufl.web.id", "assets/img/porto/excelpintar.png"));
        projects.add(new Project(5L, "Portograph", "Photographer Portfolio Template, connected to Instagram with EmbedSocial", "https://portograph.dufl.web.id", "assets/img/porto/portograph.png"));
        projects.add(new Project(6L, "Coming Soon..", "Other Project on https://github.com/widifirmaan", "#", "assets/img/porto/soon.png"));
        return projects;
    }
}
