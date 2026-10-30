# Recipe Box

A personal recipe box where each person signs up, logs in, and keeps their own private collection of recipes. Save a link to a recipe you found online, or type in your own ingredients and instructions, then favorite, search, and delete recipes as you go.

**Live demo:** https://recipe-tracker-x0zo.onrender.com

## Features

- **Sign up and log in** with email and password (passwords are hashed, never stored as plain text)
- **Private recipe box:** you can only see, change, or delete your own recipes
- **Add a recipe** with a title, link, description, ingredients, and instructions
- **Favorite recipes** with a heart; favorites move to the top of the list
- **Search** your recipes as you type (searches titles, ingredients, and instructions)
- **Expandable details** so long recipes don't take over the page
- **Delete** recipes you no longer want

## Tech stack

| Part | Tool |
|---|---|
| Server | Node.js, Express |
| Views | EJS templates |
| Authentication | Passport (local strategy), bcrypt, express-session, connect-flash |
| Database | MongoDB Atlas (Mongoose for users, MongoDB driver for recipes) |
| Front end | Vanilla JavaScript, Bootstrap 3, Font Awesome |
| Hosting | Render |

## How authorization works

Logging in proves who you are. Authorization decides what you're allowed to touch. This app uses two layers:

1. **`isLoggedIn` middleware** runs on every recipe route. If you're not signed in, the request is redirected and the route never runs.
2. **Ownership filter.** Every recipe is saved with the `userId` of its owner, and every lookup, update, and delete includes `userId: req.user.id` in the query. Even a signed-in user who guesses another person's recipe ID gets "not found."

```js
// find the recipe by ID *and* owner
{ _id: new ObjectId(req.params.id), userId: req.user.id }
```

The favorite route also builds its update from specific allowed fields instead of trusting the whole request body.

## Routes

| Method | Path | Protected | What it does |
|---|---|---|---|
| GET | `/` | No | Home page |
| GET / POST | `/signup` | No | Show and process the signup form |
| GET / POST | `/login` | No | Show and process the login form |
| GET | `/logout` | No | Log out and return home |
| GET | `/profile` | Yes | Show your recipe box (favorites first, newest first) |
| POST | `/recipes` | Yes | Save a new recipe |
| PUT | `/recipes/:id` | Yes | Favorite or un-favorite a recipe |
| DELETE | `/recipes/:id` | Yes | Delete a recipe |

## Getting started

### Requirements

- Node.js 18 (the older MongoDB driver used here may not work on the newest Node versions)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone and install

```bash
git clone https://github.com/lou7776/Recipe-Tracker.git
cd Recipe-Tracker
npm install
```

### 2. Set environment variables

Create a `.env` file in the project root:

```
MONGO_URL=your-mongodb-connection-string
SESSION_SECRET=a-long-random-string
```

Keep `.env` in `.gitignore` so your secrets never reach GitHub.

### 3. Allow your computer in Atlas

In Atlas, open **Network Access** and add your IP address. Atlas blocks every connection that isn't on this list.

### 4. Run it

```bash
node server.js
```

Open `http://localhost:8088` and sign up for an account.

## Deploying to Render

1. Push the project to GitHub.
2. Create a new **Web Service** on Render and connect the repo.
3. Set the build command to `npm install` and the start command to `node server.js`.
4. Under **Environment**, add `MONGO_URL` and `SESSION_SECRET`. A `.env` file is not uploaded, so Render needs its own copy of these values.
5. If the app crashes on the old MongoDB driver, add the environment variable `NODE_VERSION` set to `18`.
6. In Atlas **Network Access**, allow Render to connect. Render's addresses change, so a learning project usually uses `0.0.0.0/0`, with the database username and password as the real protection.

If the deployed site shows "Cannot GET /", the database connection failed. Routes are only loaded after the database connects, so check the Render logs for a connection error.

## Testing the authorization

1. Sign up as **user A** and save two recipes.
2. Log out and sign up as **user B**. The recipe box should be empty.
3. Save a recipe as B and copy its ID from the page.
4. Log back in as A and try to delete B's recipe by sending a request to `/recipes/B_RECIPE_ID`. You should get "Not found."
5. Log out and visit `/profile`. You should be redirected to the home page.

## What I learned

- How sessions and Passport keep a user logged in between requests
- Why authorization needs a check on every route, not just a locked page
- Why secrets belong in environment variables instead of code
- Debugging a failed deployment by reading logs and tracing the cause back to a database connection error

## Known limitations and next steps

- Add a "Are you sure?" confirmation before deleting a recipe
- Add an edit form for existing recipes
- Add categories or tags
- Replace `bcrypt-nodejs` (no longer maintained) with `bcrypt` or `bcryptjs`
- Replace the default in-memory session store with a database-backed one for production
- Upgrade to the current MongoDB driver and Mongoose versions
