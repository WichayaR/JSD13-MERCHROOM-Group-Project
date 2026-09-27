// Database connection for MongoDB.
require("dotenv").config();

const mongoose = require("mongoose");

// The local network can resolve Atlas records through Windows but Node's SRV
// resolver is refused. This direct-node fallback is only used for this Atlas
// cluster when the normal mongodb+srv URI fails; production still uses the
// standard URI first.
const atlasDirectNodes = {
  "cluster0.pswcprn.mongodb.net": {
    hosts: [
      "ac-af2eb1r-shard-00-00.pswcprn.mongodb.net:27017",
      "ac-af2eb1r-shard-00-01.pswcprn.mongodb.net:27017",
      "ac-af2eb1r-shard-00-02.pswcprn.mongodb.net:27017",
    ],
    replicaSet: "atlas-8cxids-shard-0",
  },
};

function buildAtlasDirectUri(uri) {
  const source = new URL(uri);
  const cluster = atlasDirectNodes[source.hostname];
  if (source.protocol !== "mongodb+srv:" || !cluster) return null;

  const options = new URLSearchParams(source.search);
  options.set("tls", "true");
  options.set("authSource", "admin");
  options.set("replicaSet", cluster.replicaSet);
  const database = source.pathname.replace(/^\//, "") || "test";

  return `mongodb://${source.username}:${source.password}@${cluster.hosts.join(",")}/${database}?${options}`;
}

async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing. Add it to server/.env or the deployment environment variables.",
      );
    }

    try {
      await mongoose.connect(process.env.MONGO_URI);
    } catch (srvError) {
      const directUri = buildAtlasDirectUri(process.env.MONGO_URI);
      if (!directUri) throw srvError;

      console.warn(
        "[DATABASE] Atlas SRV lookup failed; using the configured direct-node fallback for local development.",
      );
      await mongoose.connect(directUri);
    }
    console.log("[DATABASE] MongoDB connected successfully");
  } catch (error) {
    console.error("[DATABASE] Connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
