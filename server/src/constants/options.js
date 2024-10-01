const cookieOptions = {
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://file-management-system-seven.vercel.app",
    process.env.CLIENT_URL,
  ],
  credentials: true,
};

const helmetOptions = {
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
  // OR:
  // contentSecurityPolicy: {
  //   directives: {
  //     defaultSrc: ["'self'"],
  //     imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "blob:"],
  //     mediaSrc: ["'self'", "https://res.cloudinary.com"],
  //     connectSrc: ["'self'", "https://res.cloudinary.com"],
  //     pluginTypes: ["application/pdf"],
  //   },
  // },
};

const limiterOptions = {
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
};

const USER_TOKEN = "user_token";

export {
  cookieOptions,
  corsOptions,
  limiterOptions,
  helmetOptions,
  USER_TOKEN,
};
