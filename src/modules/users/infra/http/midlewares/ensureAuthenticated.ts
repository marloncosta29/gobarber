import { NextFunction, Request, Response } from "express";
import { verify } from 'jsonwebtoken'
import config from '../../../../../config/auth'
import AppError from '../../../../../shared/errors/app-errors'
interface TokenPayload{
  nome: string,
  iat: number,
  exp: number,
  sub: string
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction){
  const { authorization } = request.headers
  if(!authorization){
    throw new AppError('JWT token is missing', 401)
  }

  const [, token] = authorization.split(' ')
  try {
    const decoded = verify(token, config.jwt.secret)
    const { sub } = decoded  as TokenPayload
    request.user = {
      id: sub
    }
    return next()
  } catch (error) {
    throw new AppError("Invalid JWT token", 401);
  }
}