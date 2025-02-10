import fetch from 'node-fetch';

export default async function handler(req, res) {
    const streamUrl = "https://stream.wqxr.org/wqxr";

    try {
        // Open stream connection with metadata request
        const response = await fetch(streamUrl, {
            headers: { "Icy-MetaData": "1" } // Request ICY metadata
        });

        const reader = response.body.getReader();
        let metadata = "No metadata available";

        // Read the stream and extract metadata
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = new TextDecoder().decode(value);
            const match = text.match(/StreamTitle='(.*?)';/);
            if (match) {
                metadata = match[1];
                break; // Stop reading after finding metadata
            }
        }

        // Set CORS headers to allow browser access
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({ title: metadata });

    } catch (error) {
        console.error("Metadata fetch error:", error);
        res.status(500).json({ error: "Metadata fetch failed" });
    }
}
