app.get("/", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
})