const mongoose = require("mongoose");
const dns = require("dns");

const configureMongoDns = () => {
  const dnsServers = process.env.MONGO_DNS_SERVERS;

  if (!dnsServers) {
    return;
  }

  const servers = dnsServers
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (servers.length > 0) {
    dns.setServers(servers);
    console.log(`MongoDB DNS servers configured: ${servers.join(", ")}`);
  }
};

const logMongoDiagnostics = (mongoUri) => {
  console.log("MongoDB connection check started");
  console.log(`MONGO_URI exists: ${Boolean(mongoUri)}`);

  if (!mongoUri) {
    return;
  }

  const atCount = (mongoUri.match(/@/g) || []).length;
  const protocol = mongoUri.split("://")[0];

  console.log(`MongoDB URI protocol: ${protocol}`);
  console.log(`MongoDB URI @ count: ${atCount}`);

  try {
    const parsedUri = new URL(mongoUri);
    const databaseName = parsedUri.pathname.replace("/", "") || "(missing)";

    console.log(`MongoDB URI host: ${parsedUri.hostname}`);
    console.log(`MongoDB URI database: ${databaseName}`);

    if (atCount > 1) {
      console.warn("MongoDB URI warning: more than one @ found. If your password contains @, replace it with %40.");
    }

    if (!databaseName || databaseName === "(missing)") {
      console.warn("MongoDB URI warning: database name is missing after the host.");
    }
  } catch (error) {
    console.warn("MongoDB URI parse warning:", error.message);
  }
};

const normalizeMongoUri = (mongoUri) => {
  if (!mongoUri) {
    return mongoUri;
  }

  try {
    const parsedUri = new URL(mongoUri);
    const query = parsedUri.searchParams;

    if (!query.has("authSource")) {
      query.set("authSource", "admin");
    }

    if (!query.has("retryWrites")) {
      query.set("retryWrites", "true");
    }

    if (!query.has("w")) {
      query.set("w", "majority");
    }

    parsedUri.search = query.toString();
    return parsedUri.toString();
  } catch (error) {
    console.warn("MongoDB URI normalization warning:", error.message);
    return mongoUri;
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const normalizedUri = normalizeMongoUri(mongoUri);

  configureMongoDns();
  logMongoDiagnostics(normalizedUri);

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in .env");
  }

  let connection;

  try {
    connection = await mongoose.connect(normalizedUri, {
      serverSelectionTimeoutMS: 10000
    });
  } catch (error) {
    console.error("MongoDB error name:", error.name);
    console.error("MongoDB error code:", error.code || "N/A");
    console.error("MongoDB error reason:", error.reason?.toString?.() || "N/A");
    throw error;
  }

  console.log(`MongoDB connected: ${connection.connection.host}`);
};

module.exports = connectDB;
