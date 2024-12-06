import { Algorithm } from '../enum/algorithm.enum'

export interface IConfig {
  nest: INestConfig
  security: ISecurityConfig
  captcha: ICaptchaConfig
  file: IFileConfig
}

export interface INestConfig {
  port: number
}

export interface ISecurityConfig {
  expiresIn: string
  watchIn: string
  bcryptSaltOrRound: number
  algorithm: Algorithm
}

export interface ICaptchaConfig {
  color: boolean
  size: number
  noise: number
  background: string
}

export interface IFileConfig {
  allowedFormats: Array<string>
  uploadDir: string
  maxWidthImage: number
  maxHeightImage: number
}
