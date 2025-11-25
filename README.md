# Green Scouts


## Overview
Green Scouts is a web app to help motivate users to recycle more. The app contains information about materials that can be recycled, where they can be recycled, and users can collect badges as they complete recycling milestones.

This app was developed for the COMP 1800 course of BCIT's Computer Systems Technology (CST program). It demonstrates using DOM interactions to read, write, update, and delete data from a Firestore database.

---


## Features

- An interactive map to browse and filter through recycling depots in Vancouver
- Customize your own profile
- Track your recycling habits and earn badges after reaching certain milestones
- Set calendar reminders and routines to help build better recycling habits
- Responsive design for desktop and mobile

---


## Technologies Used

Example:
- **Frontend**: HTML, CSS, JavaScript, Google Maps API
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend**: Firebase for hosting
- **Database**: Firestore

---


## Usage

1. Open your browser and visit `http://localhost:3000`.
2. Navigate to the map and browse the recycling depots on it.
3. Create an account if you wish to start tracking your recycling habits.
4. Track your recycling with the recycling form, and see what badges you can collect on the badges page.
5. Set reminders and routines to recycle on the calendar.

---


## Project Structure

```
1800_202530_DTC01/
├── images/
├── src/
│   ├── components/
│       ├── site-footer.js
│       ├── site-navbar.js
│   ├── pages/
│       ├── badge.html
│       ├── calendar.html
│       ├── editProfile.html
│       ├── faq.html
│       ├── loginSignup.html
│       ├── map.html
│       ├── profile.html
│       ├── recycle.html
│       ├── scheduleForm.html
│   ├── authentication.js
│   ├── badge.js
│   ├── calendar.js
│   ├── editProfile.js
│   ├── faq.js
│   ├── firebaseConfig.js
│   ├── loginSignup.js
│   ├── map.js
│   ├── profile.js
│   ├── recycle.js
│   ├── schedule.js
│   ├── scheduleForm.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tailwind.config.js
```

---


## Contributors
- **Jasmine Foong** - BCIT CST Student with love for the outdoors and an interest in embedded systems.
- **Malcolm McQueen** - BCIT CST Student with a really cute dog.
- **Young Ji Sim** - BCIT CST Student started from Fall 2025, exploring possibilities. Fun fact: First time Malatang was in Australia, still think it was the best Mala, ever.
- **Harlan** - BCIT CST Student with a passion for game design and other nerdy stuff.

---


## Acknowledgments
- Default profile picture sourced from [FlatIcon](https://www.flaticon.com/).
- Logo and badges created by Harlan.

---


## Limitations and Future Work
### Limitations

- Map is limited to recycling depots in Vancouver

### Future Work

- Add more recycling depots to database for map to display.
- Integrate leaderboard so users can compete with each other with their recycling achievements.
- Add transitions to DOM interactions to improve user experience.
- Create a dark mode for better usability in low-light conditions.