AI Software Development Module Project: Pokémon (Battle Game) 🛠️ Project Guidelines and Requirements

🛠️ Project Guidelines and Requirements
Lesson Progress
0% Complete
New project! You’ll build a Pokémon battle game using the PokeAPI to retrieve data and build the game dynamics. Players will select a roster of Pokémon, engage in battles, and track their progress on a leaderboard.

We’ll use the PokeAPI once again, so you’ve surely seen Pokémon before but just in case, here’s a brief explanation of what Pokémon actually are and how it began as an exploration game with a battle component.

⌛ Duration: 5 days (Full Time) / 10 Days (Part Time)
📈 Presentation: TBD by Instructor | Mandatory
📝 Project Requirements
ID Functional Requirement Description
FR001 Group Project Collaborate as a team; share tasks evenly.
FR002 Follow Group‑Work Guidelines Adhere to bootcamp best‑practice guidelines at all times.
FR003 Two Public Repositories Maintain one repo for the frontend and one for the backend and one repo for your authentication service. Instructors are not collaborators.
FR004 Pull‑Request Workflow Ship all changes to main via reviewed PRs.
FR005 MongoDB Atlas Database Provision a MongoDB cluster on Atlas (or equivalent).
FR006 Users Collection Model user auth data (email, passwordHash, etc.) for registration/login.
FR007 Scores Collection Fields: userId (ObjectId ref), score (int, required), date (defaults Date.now).
FR008 Express API Setup Scaffold back‑end with Express + TypeScript (optional) following the standard folder layout.
FR009 Authentication Endpoints on your Authentication Service POST /auth/register, POST /auth/login; return JWT on successful login.
FR010 Route Protection Middleware guards any route beyond registration/login; validates JWT.
FR011 Mongoose Models Implement User and Score schemas with proper validation.
FR012 GET /leaderboard Return top scores sorted descending.
FR013 POST /leaderboard Create a new score document for the authenticated user.
FR014 React + Vite Front‑End Scaffold UI with Vite + React (JS or TS).
FR015 React Router Navigation Configure routes for Register, Login, Home, Pokémon Details, My Roster, Battle, Leaderboard.
FR016 Route Guard on Front‑End Redirect unauthenticated users to /login for protected pages.
FR017 Register Page Form posts to /auth/register. Validate inputs client‑side.
FR018 Login Page Form posts to /auth/login; store JWT on success.
FR019 Home Page Fetch Pokémon list from PokeAPI; display as cards linking to details.
FR020 Pokémon Details Page Show stats, types, abilities; “Add to Roster” action.
FR021 My Roster Page List selected Pokémon; allow removals; persist roster (localStorage or DB).
FR022 Battle Page Implement simple stat/type battle logic versus random Pokémon; track wins/losses and award points/XP. After battles, post new score to /leaderboard
FR023 Leaderboard Page Fetch from /leaderboard
FR024 Form Validation Validate all user inputs on client and server.
FR025 Error Handling & Feedback Display friendly messages for API/network errors and server validation failures.
FR026 Responsive Styling Ensure usability on mobile and desktop; Tailwind CSS recommended.
Take in mind these are the minimum features required for this project but don’t let that prevent you from being creative. Whethere you want to expand the API by means of more resources (and therefore endpoints) or want to add something to the frontend.

🤓 Tips for Effective Planning
Daily stand-ups: Use them to keep your instructor in the loop about blockers and to share insights with your classmates.
Keep things tidy and in order: You won’t find a Trello board here, but you can create one on your own!
ASK FOR HELP: If you’re stuck for more than 30 minutes, don’t hesitate to reach out for assistance!
Conclusion
This project is special for many reasons. Not only you need to bring all that you’ve learned so far but it’s a great opportunity to make it yours by being creative!
