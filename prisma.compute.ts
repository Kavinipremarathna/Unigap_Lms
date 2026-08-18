import { defineComputeConfig } from "@prisma/compute-sdk/config";

export default defineComputeConfig({
  app: {
    name: "unigap-lms",
    framework: "nextjs",
    httpPort: 3000,
    region: "ap-southeast-1",
  },
});
