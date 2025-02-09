import fetch from "node-fetch";

export default async function handler(req, res) {
    try {
        const streamUrl = "https://stream.wqxr.org/wqxr";
        const response = await fetch(streamUrl, { headers: { "Icy-MetaData": "1" } });
        const buffer = await response.arrayBuffer();
        const text = new TextDecoder().decode(buffer);

        const match = text.match(/StreamTitle='(.*?)';/);
        const title = match ? match[1] : "No metadata available";

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({ title });
    } catch (error) {
        res.status(500).json({ error: "Metadata fetch failed" });
    }
}
