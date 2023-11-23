import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleRefreshTokenService } from "./HandleRefreshTokenService";

class HandleRefreshTokenController {
  async refresh(request: Request, response: Response): Promise<Response> {
    const refreshToken =
      request.body.refreshToken ||
      request.headers["x-access-refreshToken"] ||
      request.query.refreshToken;

    const refreshTokenService = container.resolve(HandleRefreshTokenService);

    const refresh_token = await refreshTokenService.refresh(refreshToken);

    return response.json(refresh_token);
  }
}

export { HandleRefreshTokenController };
