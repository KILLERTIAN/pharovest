import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD

const Connection = async () => {

    const DB_URL = `mongodb+srv://${username}:${password}@finvest.inqniqa.mongodb.net/?retryWrites=true&w=majority&appName=finvest`

    try{
        await mongoose.connect( DB_URL )
        console.log("The Database is successfully connected.")
    }
    catch(error){
        console.log("Error while connecting DB", error)
    }
}

export default Connection