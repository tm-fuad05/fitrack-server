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
    const result = await UserService.findUserByIdFromDB(userId);
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

    const existing = await UserService.findUserByEmailFromDB(user.email);

    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }
    const result = await UserService.addUserInDB(user);

    if (result.insertedId) {
      return res.status(201).json({
        success: true,
        message: "User added to the database",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to add the user.",
    });
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
    const userId = req.params.id;
    const updatedUserInfo = req.body;

    const existingUser = await UserService.findUserByIdFromDB(userId);

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const result = await UserService.editUserInfoFromDB(
      userId,
      updatedUserInfo,
    );

    if (result.modifiedCount > 0) {
      return res
        .status(200)
        .json({ success: true, message: "User info updated" });
    }
    return res
      .status(200)
      .json({ success: false, message: "No changes were made." });
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

    const existingUser = await UserService.findUserByIdFromDB(userId);

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const result = await UserService.deleteUserFromDB(userId);

    if (result.deletedCount > 0) {
      return res.status(200).json({ success: true, data: result });
    }
    return res.status(404).json({
      success: false,
      message: "User not found or already deleted.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
}

// User Role change
async function changeUserRole(req, res) {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const existingUser = await UserService.findUserByIdFromDB(userId);

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

    const result = await UserService.changeUserRoleFromDB(userId, role);

    let message;
    if (role === "ADMIN") {
      message = "Promoted to Admin";
    } else if (role === "TRAINER") {
      message = "User is now a Trainer";
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

// Check User Role
async function checkUserRole(req, res) {
  try {
    const { email } = req.params;

    if (email !== req.decoded.email) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden access!" });
    }

    const user = await UserService.findUserByEmailFromDB(email);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      role: user?.role,
    });
  } catch (error) {
    console.error(error);
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
  checkUserRole,
};
