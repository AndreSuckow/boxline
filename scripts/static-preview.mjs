import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { gzipSync } from "node:zlib";
const root = resolve("out");
const base = "/boxline";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".png": "image/png",
  ".json": "application/json",
};
createServer(async (req, res) => {
  try {
    const path = new URL(req.url, "http://127.0.0.1").pathname;
    if (path === base) {
      res.writeHead(301, { Location: base + "/" });
      res.end();
      return;
    }
    if (!path.startsWith(base + "/")) {
      res.writeHead(404);
      res.end();
      return;
    }
    let file = resolve(
      root,
      decodeURIComponent(path.slice(base.length + 1)) || "index.html",
    );
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    } catch {
      file = resolve(root, "404.html");
      res.statusCode = 404;
    }
    res.setHeader(
      "Content-Type",
      types[extname(file)] || "application/octet-stream",
    );
    const data = await readFile(file);
    if (
      req.headers["accept-encoding"]?.includes("gzip") &&
      [".html", ".css", ".js", ".svg", ".txt", ".json"].includes(extname(file))
    ) {
      res.setHeader("Content-Encoding", "gzip");
      res.setHeader("Vary", "Accept-Encoding");
      res.end(gzipSync(data));
    } else res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
}).listen(Number(process.env.PREVIEW_PORT || 3001), "127.0.0.1", () =>
  console.log(
    "Static preview: http://127.0.0.1:" +
      (process.env.PREVIEW_PORT || 3001) +
      "/boxline/",
  ),
);
