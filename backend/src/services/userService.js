import prisma from "../config/db.js";

class UserService {
    static async getAllUsers() {
        return await prisma.user.findMany({
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
            phone: true,
            role: true
          }
        });
      }

  static async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id, username, firstname, lastname, email, phone, role }
    });
  }

  static async createUser(data) {
    return await prisma.user.create({
      data: {
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        password: data.password,
        email: data.email,
        phone: data.phone || null,
        role: data.role || "U",
      },
    });
  }

  static async updateUser(id, data) {
    const { id: _, ...updateData } = data;
    return await prisma.user.update({
        where: { id: Number(id) },
        data: updateData,
        select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
            phone: true,
            role: true
        }
    });
}


  static async deleteUser(id) {
    return await prisma.user.delete({ where: { id: Number(id) } });
  }
}

export default UserService;
