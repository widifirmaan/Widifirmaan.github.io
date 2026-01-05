package com.widifirmaan.porto.model;

import java.util.List;

public class Project {

    private Long id;
    private String name;
    private String description;
    private String demoUrl;
    private String repoUrl;
    private List<String> imageUrls;
    private List<String> features;
    private List<String> techStack;
    private String database;

    public Project(Long id, String name, String description, String demoUrl, String repoUrl, List<String> imageUrls, List<String> features, List<String> techStack, String database) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.demoUrl = demoUrl;
        this.repoUrl = repoUrl;
        this.imageUrls = imageUrls;
        this.features = features;
        this.techStack = techStack;
        this.database = database;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDemoUrl() {
        return demoUrl;
    }

    public void setDemoUrl(String demoUrl) {
        this.demoUrl = demoUrl;
    }

    public String getRepoUrl() {
        return repoUrl;
    }

    public void setRepoUrl(String repoUrl) {
        this.repoUrl = repoUrl;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }

    public List<String> getTechStack() {
        return techStack;
    }

    public void setTechStack(List<String> techStack) {
        this.techStack = techStack;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }
}
