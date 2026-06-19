import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HUGGING_FACE_API_KEY);

export default client;