# Porto — Personal Portfolio Website

A Spring Boot-based portfolio website containing static assets and templates for showcasing projects, contact details, and resume information.

## Contents
- `src/main/java` — backend application code
- `src/main/resources/static` — static website files (assets, HTML)
- `src/main/resources/templates` — server-side templates (if used)

## Requirements
- Java JDK 17 or newer
- Maven 3.6+

## Run locally

Build and run with Maven:

```bash
mvn clean package
mvn spring-boot:run
```

Or run the packaged jar:

```bash
java -jar target/porto-0.0.1-SNAPSHOT.jar
```

Static site files live under `src/main/resources/static`. Note: this folder may be managed as a git submodule in this repository — changes there may require committing and pushing inside that sub-repo first.

## Branches
- The `springboot` branch contains the Spring Boot application and was pushed to the configured remote.

## Contributing
- Make changes on a feature branch and open a pull request against `springboot`.
- If you modify `src/main/resources/static` and it is a submodule, commit and push inside that submodule before updating the parent repository.

## License & Contact
This is a personal portfolio project. For questions or updates, contact the repository owner.
