package org.upgrad.upstac.config.api;

import com.google.common.base.Predicate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.upgrad.upstac.users.roles.UserRole;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collections;
import java.util.List;

import static com.google.common.base.Predicates.or;
import static springfox.documentation.builders.PathSelectors.ant;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

    /**
     * Configures the Swagger Docket for API documentation.
     *
     * @return Docket configured for Swagger.
     */
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.any())
                .paths(documentedPaths())
                .build()
                .securitySchemes(securitySchemes())
                .securityContexts(securityContexts());
    }

    /**
     * Provides API information for Swagger documentation.
     *
     * @return ApiInfo object with API details.
     */
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder().title("Upgrad UPSTAC System")
                .description("UPSTAC Track APIs")
                .contact("Upgrad")
                .license("Apache 2.0")
                .licenseUrl("http://www.apache.org/licenses/LICENSE-2.0.html")
                .version("1.0.0")
                .build();
    }

    /**
     * Defines the paths to be documented in the API.
     *
     * @return Predicate for paths to be documented.
     */
    private Predicate<String> documentedPaths() {
        return or(
                ant("/auth/**"),
                ant("/documents/**"),
                securedPaths()  // Include secured paths in documentation.
        );
    }

    /**
     * Defines the secured paths for the API.
     *
     * @return Predicate for secured paths.
     */
    private Predicate<String> securedPaths() {
        return or(
                ant("/api/testrequests/**"),
                ant("/api/government/**"),
                ant("/api/consultations/**"),
                ant("/users/**"),
                ant("/api/labrequests/**")
        );
    }

    /**
     * Configures the security schemes for the API.
     *
     * @return List of SecurityScheme objects.
     */
    private List<SecurityScheme> securitySchemes() {
        return Collections.singletonList(new ApiKey("Authorization", "Authorization", "header"));
    }

    /**
     * Configures the security contexts for the API.
     *
     * @return List of SecurityContext objects.
     */
    private List<SecurityContext> securityContexts() {
        return Collections.singletonList(
                SecurityContext.builder()
                        .securityReferences(securityReferences())
                        .forPaths(securedPaths())  // Apply security contexts to secured paths.
                        .build()
        );
    }

    /**
     * Defines the security references for authorization.
     *
     * @return List of SecurityReference objects.
     */
    private List<SecurityReference> securityReferences() {
        AuthorizationScope[] authorizationScopes = {
                new AuthorizationScope(getScope(UserRole.DOCTOR), "Doctors"),
                new AuthorizationScope(getScope(UserRole.TESTER), "Testers"),
                new AuthorizationScope(getScope(UserRole.GOVERNMENT_AUTHORITY), "Government Authority"),
                new AuthorizationScope(getScope(UserRole.USER), "Registered users")
        };
        return Collections.singletonList(new SecurityReference("Authorization", authorizationScopes));
    }

    /**
     * Retrieves the scope string for a given user role.
     *
     * @param role The UserRole for which to get the scope.
     * @return String representing the scope for the role.
     */
    private String getScope(UserRole role) {
        return role.name();
    }
}
