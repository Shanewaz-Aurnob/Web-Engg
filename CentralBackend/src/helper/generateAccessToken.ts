import jwt from "jsonwebtoken";

export function generateAccessToken(userId: string) {
  if (!userId) {
    console.log("Unable to create access token, No user info given");
    return null;
  }
  return jwt.sign({ userId }, process.env.SECRET_TOKEN ?? "secret_token", {
    expiresIn: "7d",
  });
}
