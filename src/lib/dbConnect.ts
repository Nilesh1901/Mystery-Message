import mongoose from "mongoose";
type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Db allready connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    console.log(db);
    console.log(db.connections);
    connection.isConnected = db.connections[0].readyState;
    console.log("Db connected successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export default dbConnect;
