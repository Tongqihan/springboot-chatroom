package com.example.chatroom.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 后端基础 CORS 配置，便于本地联调。
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private static final String[] DEV_ALLOWED_ORIGINS = {
            "http://localhost:5173",
            "http://127.0.0.1:5173"
    };

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(DEV_ALLOWED_ORIGINS)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
