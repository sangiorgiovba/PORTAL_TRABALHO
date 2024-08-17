import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("A CONEXAO ESTA FUNCIONANDO COM O BANCO DE DADOS");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
