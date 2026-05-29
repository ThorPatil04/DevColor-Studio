# 🎨 DevColor Studio — Full-Stack Developer Color Platform

DevColor Studio is a premium, state-of-the-art developer color utility platform designed for developers and designers to generate, customize, convert, analyze, and save color schemes.

This project is organized as a clean mono-repo comprising:
1. **Frontend**: A highly responsive Single Page Application (SPA) built using React.js, Tailwind CSS, Framer Motion, and Axios, scaffolded via Vite.
2. **Backend**: A robust REST API built using Spring Boot, Spring Security (JWT-based stateless sessions), Spring Data JPA, and a MySQL database server.

---

## 📂 Project Architecture & Folder Structures

Below is the file layout of the entire workspace. Every single file has been crafted to conform to production-level standards.

```
ColorCraft/
├── backend/                             # Spring Boot Maven Project
│   ├── pom.xml                          # Maven dependency descriptor
│   └── src/
│       └── main/
│           ├── java/com/devcolor/studio/
│           │   ├── DevColorStudioApplication.java  # Main application entry point
│           │   ├── config/
│           │   │   └── SecurityConfig.java         # Spring Security 3.x configuration & CORS filter
│           │   ├── controller/
│           │   │   ├── AuthController.java         # Login & registration REST endpoints
│           │   │   ├── PaletteController.java      # Secured palette CRUD REST endpoints
│           │   │   └── GradientController.java     # Secured gradient CRUD REST endpoints
│           │   ├── dto/
│           │   │   ├── AuthRequest.java            # DTO for logging in (username/password)
│           │   │   ├── AuthResponse.java           # DTO returned on login (JWT + profile details)
│           │   │   ├── RegisterRequest.java        # DTO for sign up (username/email/password)
│           │   │   ├── PaletteDTO.java             # DTO representation of color palettes
│           │   │   └── GradientDTO.java            # DTO representation of gradients
│           │   ├── exception/
│           │   │   ├── ResourceNotFoundException.java # Custom 404 handler exception
│           │   │   ├── BadRequestException.java       # Custom 400 handler exception
│           │   │   └── GlobalExceptionHandler.java    # @RestControllerAdvice global JSON error handler
│           │   ├── model/
│           │   │   ├── User.java                   # JPA entity representing users and security roles
│           │   │   ├── Palette.java                # JPA entity representing saved color palettes
│           │   │   └── Gradient.java               # JPA entity representing saved gradients
│           │   ├── repository/
│           │   │   ├── UserRepository.java         # JPA repository interface for Users
│           │   │   ├── PaletteRepository.java      # JPA repository interface for Palettes
│           │   │   └── GradientRepository.java      # JPA repository interface for Gradients
│           │   ├── security/
│           │   │   ├── CustomUserDetails.java      # Adapts User entity to Spring UserDetails
│           │   │   ├── CustomUserDetailsService.java # Loads user profiles from MySQL during auth
│           │   │   ├── JwtTokenProvider.java       # Cryptographic JWT creation, parsing, & validation
│           │   │   ├── JwtAuthenticationEntryPoint.java # Intercepts access failures and returns 401
│           │   │   └── JwtAuthenticationFilter.java # OncePerRequest header parsing JWT filter
│           │   └── service/
│           │       ├── UserService.java            # Interface contract for User authentication
│           │       ├── UserServiceImpl.java        # Hashing and token coordination implementation
│           │       ├── PaletteService.java         # Interface contract for Palette CRUD
│           │       ├── PaletteServiceImpl.java     # Comma-split parsing & ownership checking implementation
│           │       ├── GradientService.java        # Interface contract for Gradient CRUD
│           │       └── GradientServiceImpl.java    # Angle and stop parsing implementation
│           └── resources/
│               └── application.properties       # Database credentials & JWT secret configurations
│
└── frontend/                            # Vite React.js Project
    ├── package.json                     # Node.js dependencies (Tailwind, Framer Motion, Axios)
    ├── vite.config.js                   # Vite configuration (port 5173)
    ├── tailwind.config.js               # Tailwind CSS rules, customized branding colors & animations
    ├── postcss.config.js                # PostCSS rules hook
    ├── index.html                       # HTML structural shell
    └── src/
        ├── main.jsx                     # StrictMode bootloader wrapping global providers
        ├── App.jsx                      # Unified dashboard router & sidebar navigation layout
        ├── index.css                    # Global styling, Google Fonts link, and Glassmorphism variables
        ├── context/
        │   ├── ThemeContext.jsx         # Controls light/dark state (class additions to HTML element)
        │   └── AuthContext.jsx          # Captures JWT logins, logouts, registration, and localStorage persistence
        ├── services/
        │   ├── api.js                   # Base Axios instance with automated Authorization headers filter
        │   ├── paletteService.js        # Axios wrapper for palette CRUD APIs
        │   └── gradientService.js       # Axios wrapper for gradient CRUD APIs
        ├── utils/
        │   └── colorUtils.js            # Math engines: Conversions (HEX/RGB/HSL), relative luminance, WCAG grades, harmony shufflers, and Euclidean distance Tailwind matches
        └── views/
            ├── PaletteGenerator.jsx     # Visual palette locks, shuffling, harmonies and CSS/TW code exports
            ├── GradientGenerator.jsx    # Visual angle/stop sliders, type togglers and visual canvas
            ├── ColorConverter.jsx       # Real-time multi-directional input synchronization
            ├── AccessibilityChecker.jsx # WCAG 2.1 Level AA/AAA relative legibility checking card
            ├── TailwindFinder.jsx       # Side-by-side spec comparison to matching Tailwind system color
            ├── FavoritesView.jsx        # Grid displaying saved palettes and gradients loaded from MySQL
            └── AuthView.jsx             # Clean glassmorphism login and signup forms
```

---

## ⚡ Setup & Local Run Instructions

Follow these step-by-step instructions to get DevColor Studio running on your local machine.

### Prerequisites
- **Java Development Kit (JDK)**: Version 17 or higher (Java 24 verified!).
- **Maven**: For compilation and dependency management.
- **Node.js**: Version 18.x or higher (Node 24 verified!).
- **MySQL Database**: Installed and running.

---

### Step 1: Database Setup
1. Log in to your local MySQL CLI or administration tool (e.g., MySQL Workbench).
2. Create the database for our application:
   ```sql
   CREATE DATABASE devcolor_db;
   ```
3. Ensure your MySQL server matches the settings in `backend/src/main/resources/application.properties`:
   - **Host**: `localhost:3306`
   - **Database**: `devcolor_db`
   - **Username**: `root`
   - **Password**: `root`
   *(If your database password differs, simply modify the `spring.datasource.password` line in `application.properties` to match your MySQL setup.)*

---

### Step 2: Running the Spring Boot Backend
1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Run Maven compile to download all packages and build the project:
   ```bash
   mvn clean compile
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
4. The REST API will spin up and run on **`http://localhost:8080`**.
   - *Note*: Hibernate will automatically inspect the schema and generate the tables (`users`, `user_roles`, `palettes`, and `gradients`) on startup.

---

### Step 3: Running the React Frontend
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install the node packages:
   ```bash
   npm install
   ```
3. Spin up the Vite development server:
   ```bash
   npm run dev
   ```
4. The React application will load and serve on **`http://localhost:5173`**. Open this URL in your web browser!

---

## 🚢 Production Deployment Instructions

To package, compile, and deploy DevColor Studio for a production environment, implement the following actions.

### 1. Deploying the Spring Boot REST API
#### A. Compile to JAR
Navigate to the `backend/` folder and build a single, self-contained production executable JAR file, skipping test suites:
```bash
mvn clean package -DskipTests
```
This compiles the code and places a high-performance, compressed JAR in `backend/target/studio-0.0.1-SNAPSHOT.jar`.

#### B. Running the production bundle
On your production Linux/Windows server, run the JAR using the java runtime environment:
```bash
java -jar target/studio-0.0.1-SNAPSHOT.jar
```
*Tip*: In production, always supply custom database credentials and JWT keys externally via environment variables to keep your files secure:
```bash
java -Dspring.datasource.password=secureProdPassword -Djwt.secret=yourVeryLongBase64SecretKey -jar studio-0.0.1-SNAPSHOT.jar
```

---

### 2. Deploying the React Frontend
#### A. Build the production assets
Navigate to the `frontend/` folder and trigger the optimized compilation bundle:
```bash
npm run build
```
This utilizes Rollup under Vite to compile, tree-shake, and compress the React JS files, Tailwind classes, and media into highly optimized, caching-friendly static assets inside the **`frontend/dist/`** directory.

#### B. Hosting the assets
The `dist/` folder contains only pure HTML, CSS, and JS. This can be served by any static host:
- **Nginx / Apache**: Copy the contents of `dist/` to the public document root of your web server (e.g. `/var/www/html`), and configure the fallback routing to redirect all paths back to `index.html` (since React uses client-side routing).
- **Vercel / Netlify**: Connect your GitHub repository, choose `frontend/` as the root directory, set the build command to `npm run build` and output folder to `dist`. Both hosts will automatically deploy it for free!
