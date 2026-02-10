export const allowRoles = (...r: string[]) =>
  (req: any, _: any, n: any) =>
    r.includes(req.user.role) ? n() : n(new Error("Forbidden"));