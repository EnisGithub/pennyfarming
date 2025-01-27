const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Datei-Pfad für Speicherung
const DATA_FILE = "./data.json";

// Daten laden
function loadData() {
    if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE));
    }
    return {};
}

// Daten speichern
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Initialisiere Daten
let earningsData = loadData();

// API-Endpunkte
app.get("/api/earnings", (req, res) => res.json(earningsData));

app.post("/api/earnings", (req, res) => {
    const { platform, date, amount } = req.body;
    if (!platform || !date || typeof amount !== "number") {
        return res.status(400).json({ error: "Invalid data" });
    }
    if (!earningsData[platform]) earningsData[platform] = [];
    earningsData[platform].push({ date, amount });
    saveData(earningsData);
    res.json({ success: true });
});

app.post("/api/platforms", (req, res) => {
    const { platform } = req.body;
    if (!platform || earningsData[platform]) {
        return res.status(400).json({ error: "Invalid platform" });
    }
    earningsData[platform] = [];
    saveData(earningsData);
    res.json({ success: true });
});

app.delete("/api/earnings", (req, res) => {
    earningsData = {};
    saveData(earningsData);
    res.json({ success: true });
});

// Server starten
app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));
