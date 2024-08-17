import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios.",
        success: false,
      });
    }
   
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({
            message: 'Já existe um usuário com este e-mail.',
            success: false,
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        fullname,
        email,
        phoneNumber,
        password: hashedPassword,
        role,
    });

    return res.status(201).json({
        message: "Conta criada com sucesso.",
        success: true
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return res.status(500).json({
      message: "Erro interno do servidor.",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios.",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "E-mail ou senha incorretos.",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "E-mail ou senha incorretos.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "A conta não existe com a função atual.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Bem-vindo de volta, ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({
      message: "Erro interno do servidor.",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Desconectado com sucesso.",
      success: true,
    });
  } catch (error) {
    console.error("Erro ao desconectar:", error);
    return res.status(500).json({
      message: "Erro interno do servidor.",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    let skillsArray = skills ? skills.split(",") : [];
    const userId = req.id;

    if (!userId) {
      return res.status(400).json({
        message: "ID do usuário não fornecido.",
        success: false,
      });
    }

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado.",
        success: false,
      });
    }

    if (fullname) {
      user.fullname = fullname;
    }
    if (email) {
     
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          message: "Já existe um usuário com este e-mail.",
          success: false,
        });
      }
      user.email = email;
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    if (bio) {
      user.profile.bio = bio;
    }
    if (skillsArray.length) {
      user.profile.skills = skillsArray;
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res.status(200).json({
      message: "Informações atualizadas com sucesso.",
      user,
      success: true,
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return res.status(500).json({
      message: "Erro interno do servidor.",
      success: false,
    });
  }
};
