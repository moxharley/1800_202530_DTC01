import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                loginSignup: resolve(__dirname, "./src/pages/loginSignup.html"),
                badge: resolve(__dirname, "./src/pages/badge.html"),
                calendar: resolve(__dirname, "./src/pages/calendar.html"),
                editProfile: resolve(__dirname, "./src/pages/editProfile.html"),
                faq: resolve(__dirname, "./src/pages/faq.html"),
                map: resolve(__dirname, "./src/pages/map.html"),
                profile: resolve(__dirname, "./src/pages/profile.html"),
                recycle: resolve(__dirname, "./src/pages/recycle.html"),
                scheduleForm: resolve(__dirname, "./src/pages/scheduleForm.html"),
            }
        }
    }
});
