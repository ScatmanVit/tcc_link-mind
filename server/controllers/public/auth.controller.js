import { captalize, findOneUser, formatEmail } from "../../utils/utils.js"
import UserService from "../../services/public/public.routes.js"
import redis from '../../config/redis.js'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

const jwt_secret = process.env.JWT_SECRET

async function createUserController(req, res) {
   const { name, email, password } = req.body
   
   if (!name || !email || !password) {
         return res.status(400).json({ 
          message: "Dados não recebidos, por favor preencha todos os campos" 
      });
    }

   let hashPassword;
   if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
   }
   
   try {
      const userExist = await findOneUser(formatEmail(email), "")
      if(userExist){
         return res.status(400).json({ 
            message: "Já existe um usuário cadastrado nesse email" 
         })
      }
      await UserService.createUserService({
         name: name, 
         email: formatEmail(email),
         password: hashPassword
      })
      return res.status(201).json({ 
         message: `Conta criada! Seja muito bem-vindo ${captalize(name)}.`  
      })
   } catch(err) {
      console.error("Ocorreu um erro no servidor, [ CREATE USER ] ", err)
      return res.status(500).json({
         message: "Ocorreu um erro no servidor" 
      })
   }  
}

async function loginUserController(req, res) {
  const { email, password, platform } = req.body;
  if (!email || !password || !platform) {
      return res.status(400).json({
        message: "Dados não recebidos, por favor preencha todos os campos."
      });
  }

  try {
    const user = await findOneUser(formatEmail(email), "");
    if (!user) {
      return res.status(400).json({ 
         message: "Não foi encontrado um usuário com esse E-mail" 
      });
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ 
          message: "Credenciais inválidas." 
        });
      }
    }

    const access_token = jwt.sign(
      { id: user.id, email: user.email },
      jwt_secret,
      { expiresIn: "1d" }
    );
    const refresh_token = jwt.sign(
      { id: user.id, email: user.email },
      jwt_secret,
      { expiresIn: "7d" }
    );

    try {
      const cretedRefreshLogin = await redis.set(`refresh_token:${user.id}`, refresh_token, "EX", 7 * 24 * 60 * 60);
      console.log(cretedRefreshLogin)
    } catch(err) {
      return console.log("Erro ao criar/guardar o refresh token [ LOGIN ]", err)
    }

    if (platform === "mobile") {
      return res.status(200).json({
        message: "Login efetuado com sucesso!",
        access_token,
        refresh_token,
        nameUser: user.name
      });
    }

    if (platform === "web") {
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        message: "Login efetuado com sucesso!",
        access_token,
      });
    }
  } catch (err) {
    console.error("Ocorreu um erro no servidor, [ LOGIN USER ]", err);
    return res.status(500).json({ 
      message: "Ocorreu um erro no servidor" 
    });
  }
}


async function refreshTokenController(req, res) {
  const { userId, platform } = req.body;
  const token_mobile = req.headers.authorization;
  const token_web = req.cookies.refresh_token; 

  if (!["mobile", "web"].includes(platform)) {
    return res.status(400).json({ 
      message: "Plataforma inválida" 
    });
  }

  try {
    let decoded;
    let token;

    if (platform === "mobile") {
      if (!token_mobile) {
        return res.status(400).json({ 
          message: "Token não fornecido para mobile." 
        });
      }
      token = token_mobile.replace("Bearer ", "");
      decoded = jwt.verify(token, jwt_secret);
    }

    if (platform === "web") {
      if (!token_web) {
        return res.status(400).json({ message: "Token não fornecido para web." });
      }
      token = token_web;
      decoded = jwt.verify(token, jwt_secret);
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Token inválido" });
    }

    if (decoded.id !== userId) {
      return res.status(403).json({
        message: "ID do token não corresponde ao id usuário fornecido",
      });
    }

    const storedRefreshToken = await redis.get(`refresh_token:${userId}`);
    if (!storedRefreshToken || storedRefreshToken !== token) {
      return res.status(401).json({ message: "Refresh token inválido ou expirado." });
    }

    const user = await findOneUser("", userId);
    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const access_token = jwt.sign(
      { id: user.id, email: user.email },
      jwt_secret,
      { expiresIn: "1d" }
    );
    const refresh_token = jwt.sign(
      { id: user.id, email: user.email },
      jwt_secret,
      { expiresIn: "7d" }
    );

    await redis.set(`refresh_token:${userId}`, refresh_token, "EX", 7 * 24 * 60 * 60);

    if (platform === "mobile") {
      return res.status(200).json({
        message: "Sessão renovada com sucesso",
        access_token,
        refresh_token,
      });
    }

    if (platform === "web") {
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        message: "Sessão renovada com sucesso",
        access_token,
      });
    }
  } catch (err) {
    console.error("Erro no refresh_token [ REFRESH TOKEN ]", err);
    return res.status(500).json({ message: "Erro no servidor" });
  }
}


async function logoutController(req, res) {
  const { platform } = req.body;

  if (!["mobile", "web"].includes(platform)) {
    return res.status(400).json({
      message: "Plataforma inválida"
    });
  }

  try {
    let token;

    if (platform === "mobile") {
      const tokenMob = req.headers.authorization;
      if (!tokenMob) {
        return res.status(400).json({
          message: "Token não fornecido"
        });
      }
      token = tokenMob.replace("Bearer ", "");
    }

    if (platform === "web") {
      token = req.cookies.refresh_token;
      if (!token) {
        return res.status(400).json({
          message: "Token não fornecido"
        });
      }
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwt_secret);
    } catch (err) {
      return res.status(401).json({
        message: "Token inválido"
      });
    }

    try {
      await redis.del(`refresh_token:${decoded.id}`);
    } catch (err) {
      console.error("Erro ao deletar o token", err);
      return res.status(500).json({
        message: "Erro no servidor"
      });
    }

    if (platform === "web") {
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }

    return res.status(200).json({
      message: "Logout efetuado com sucesso!"
    });
  } catch (err) {
    console.error("Erro no logout", err);
    return res.status(500).json({
      message: "Erro no servidor [ LOGOUT USER ]"
    });
  }
}




export default {
   createUserController,
   loginUserController,
   logoutController,
   refreshTokenController
}