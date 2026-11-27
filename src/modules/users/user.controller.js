import { rejects } from "node:assert";
import { UserService } from "./user.service.js";

// Get All Users
async function getAllUsers(req, res) {
  try {
    const result = await UserService.getAllUsersfromDB();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GET User Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Get Specific User
async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const result = await UserService.getUserByIdFromDB(userId);

    if (!result) {
      return res.status(404).json({ success: false, message: "Not found." });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GET User Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Get Specific User
async function getMyUserData(req, res) {
  try {
    const { email } = req.decoded;
    const result = await UserService.getMyUserDataFromDB(email);

    if (!result) {
      return res.status(404).json({ success: false, message: "Not found." });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GET User Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Post Users
async function addUser(req, res) {
  try {
    const user = req.body;

    const existing = await UserService.getMyUserDataFromDB(user.email);

    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }
    const result = await UserService.addUserInDB(user);

    if (result) {
      return res.status(201).json({
        success: true,
        message: "User added to the database",
        data: result,
      });
    }
  } catch (error) {
    console.error("POST User error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// Edit User Info
async function editUserInfo(req, res) {
  try {
    const { email } = req.query;
    const updatedUserInfo = req.body;
    const { email: currentEmail } = req.decoded;

    const existingUser = await UserService.getMyUserDataFromDB(email);

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (existingUser.email !== currentEmail) {
      return res.status(400).json({
        success: false,
        message: "You can't change other user's info",
      });
    }

    const result = await UserService.editUserInfoFromDB(email, updatedUserInfo);
    console.log(result);

    if (result.modifiedCount > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Profile updated" });
    }
    if (result.modifiedCount === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No changes were made." });
    }
  } catch (error) {
    console.error("PATCH User error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

// Delete User
async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    const { email } = req.decoded;

    const existingUser = await UserService.getUserByIdFromDB(userId);

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (existingUser?.email === email) {
      return res.status(400).json({
        success: false,
        message: "You can't delete yourself from database",
      });
    }

    const result = await UserService.deleteUserFromDB(userId);

    if (result) {
      return res.status(200).json({
        success: true,
        message: `User: ${existingUser.name} deleted successfully`,
        data: result,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
}

// User Role change
async function changeUserRole(req, res) {
  try {
    const { email } = req.query;
    const { email: currentEmail } = req.decoded;
    const { role } = req.body;

    const existingUser = await UserService.getMyUserDataFromDB(email);

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (existingUser.role === role) {
      return res.status(400).json({
        success: false,
        message: `User is already a ${role.toLowerCase()}.`,
      });
    }

    if (existingUser.email === currentEmail) {
      return res.status(400).json({
        success: false,
        message: "You can't change your own role",
      });
    }

    const result = await UserService.changeUserRoleFromDB(email, role);

    let message;
    if (role === "ADMIN") {
      message = "Promoted to Admin";
    } else message = "Demoted to Member";

    if (result.modifiedCount > 0) {
      return res.status(200).json({ success: true, message: message });
    }
    return res.status(200).json({
      success: false,
      message: "No changes were made.",
    });
  } catch (error) {
    console.error("PATCH USER ROLE CHANGE ERROR", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export const UserController = {
  getAllUsers,
  getUserById,
  editUserInfo,
  addUser,
  deleteUser,
  changeUserRole,
  getMyUserData,
};
