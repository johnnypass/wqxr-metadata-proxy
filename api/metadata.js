import fetch from 'node-fetch';

export default async function handler(req, res) {
    const streamUrl = "https://stream.wqxr.org/wqxr";

    try {
        const response = await fetch(streamUrl, { headers: { "Icy-MetaData": "1" } });
        const buffer = await response.arrayBuffer();
        const text = new TextDecoder().decode(buffer);
        
        console.log("Raw metadata:", text);

        const match = text.match(/StreamTitle='(.*?)';/);
        const title = match ? match[1] : "No metadata available";

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({ title });
    } catch (error) {
        console.error("Metadata fetch error:", error);
        res.status(500).json({ error: "Metadata fetch failed" });
    }
}
