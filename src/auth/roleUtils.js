export const isAdmin = (user) =>
  user?.role === "admin" || user?.role === "superuser";

export const isSuperuser = (user) => user?.role === "superuser";
