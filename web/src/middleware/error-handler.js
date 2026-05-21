import { ZodError } from "zod";

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Invalid request",
      details: error.flatten(),
    });
  }

  console.error("Unexpected server error:", {
    name: error.name,
    message: error.message,
  });

  return res.status(500).json({
    error: "Unexpected server error",
  });
}
