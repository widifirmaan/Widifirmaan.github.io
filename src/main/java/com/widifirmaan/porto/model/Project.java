package com.widifirmaan.porto.model;

public class Project {

    private Long id;
    private String name;
    private String description;
    private String url;
    private String imageUrl;

    public Project(Long id, String name, String description, String url, String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.url = url;
        this.imageUrl = imageUrl;
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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
