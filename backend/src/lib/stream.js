import {StreamChat} from 'stream-chat';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    console.log('STREAM_API_KEY and STREAM_API_SECRET must be set in the environment variables');
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) =>{
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }
}

// TODO : create a function to generate a Stream token
export const generateStreamToken = (userId) => {

}