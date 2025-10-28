/**
 * Authentication utility functions for client-side operations
 */

const AUTH_USER_KEY = "ticketapp_user";
const AUTH_SESSION_KEY = "ticketapp_session";

export function getCurrentUser() {
  try {
    const userJson = localStorage.getItem(AUTH_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export function getAllUsers() {
  try {
    const usersJson = localStorage.getItem(AUTH_SESSION_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users:", error);
  }
}

export async function login(email, password) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const users = getAllUsers();
  const existingUser = users.find((record) => record.email === email);

  if (!existingUser) {
    throw new Error("No account found for that email address.");
  }

  if (existingUser.password !== password) {
    throw new Error("Incorrect password. Please try again.");
  }

  const activeUser = { ...existingUser, sessionActive: true };
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(activeUser));

  // Update session with active status
  const updatedUsers = users.map((u) =>
    u.id === existingUser.id ? { ...u, sessionActive: true } : u
  );
  saveUsers(updatedUsers);

  return activeUser;
}

export async function signup(name, email, password) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const users = getAllUsers();
  const isEmailTaken = users.find((record) => record.email === email);

  if (isEmailTaken) {
    throw new Error("An account with that email already exists.");
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    sessionActive: true,
  };

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
  saveUsers([...users, newUser]);

  return newUser;
}

export function logout() {
  const currentUser = getCurrentUser();

  if (currentUser) {
    const users = getAllUsers();
    const updatedUsers = users.map((u) =>
      u.id === currentUser.id ? { ...u, sessionActive: false } : u
    );
    saveUsers(updatedUsers);
  }

  localStorage.removeItem(AUTH_USER_KEY);
}

export function isAuthenticated() {
  const user = getCurrentUser();
  return user !== null && user.sessionActive === true;
}

export function requireAuth(loginUrl = "/auth/login") {
  if (!isAuthenticated()) {
    window.location.href = loginUrl;
  }
}

export function redirectIfAuthenticated(homeUrl = "/") {
  if (isAuthenticated()) {
    window.location.href = homeUrl;
  }
}