package pi.turathai.turathaibackend.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import pi.turathai.turathaibackend.Services.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()  // Allow auth endpoints
                        .requestMatchers("/api/users/**").permitAll()  // Explicitly allow registration
                        .requestMatchers("/api/badges/**").permitAll()
                        .requestMatchers("/api/qrcode/**").permitAll()  // Allow auth endpoints

                        .requestMatchers("/api/businesses/**").permitAll()
                        .requestMatchers("/api/Categories/**").permitAll()
                        .requestMatchers("/api/comments/**").permitAll()
                        .requestMatchers("/api/crowd-heatmaps/**").permitAll()
                        .requestMatchers("/api/earned/**").permitAll()
                        .requestMatchers("/api/events/**").permitAll()
                        .requestMatchers("/api/forums/**").permitAll()
                        .requestMatchers("/api/export/**").permitAll()  // Add this line
                        .requestMatchers("/api/itineries/export/**").permitAll()
                        .requestMatchers("/api/export/**").permitAll()  // Add this line
                        .requestMatchers("/api/itineries/**").permitAll()
                        .requestMatchers("/api/reviews/**").permitAll()
                        .requestMatchers("/api/local-insights/**").permitAll()
                        .requestMatchers("/api/stops/**").permitAll()
                        .requestMatchers("/api/user-preferences/**").permitAll()
                        .requestMatchers("/api/wishlist/**").permitAll()
                        .requestMatchers("/api/upload", "/assets/**").permitAll()
                        .requestMatchers("/images/**").permitAll()
                        .requestMatchers("/api/**").authenticated()  // Secure other API endpoints
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("*"); // Allow all origins (replace with your frontend URL)
        configuration.addAllowedMethod("*"); // Allow all HTTP methods
        configuration.addAllowedHeader("*"); // Allow all headers
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    public AuthenticationManager authenticationManager(
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}