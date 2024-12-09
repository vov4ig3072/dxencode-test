import { Algorithm } from '../enum/algorithm.enum'
import { IConfig } from '../interfaces/config.interface'
import * as path from 'node:path'

const config: IConfig = {
  nest: {
    port: 3000,
  },
  security: {
    expiresIn: '1d',
    watchIn: '1d',
    bcryptSaltOrRound: 10,
    algorithm: Algorithm.HS256,
  },
  captcha: {
    background: '#000',
    color: true,
    noise: 3,
    size: 2,
  },
  file: {
    allowedFormats: ['image/jpeg', 'image/png', 'image/gif'],
    uploadDir: path.join('..', '..', '..', 'assets'),
    maxHeightImage: 240,
    maxWidthImage: 320,
  },
  redis: { url: 'redis://localhost:6379' },
}

export default (): IConfig => config
