import { Algorithm } from '../enum/algorithm.enum'
import { IConfig } from '../interfaces/config.interface'

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
}

export default (): IConfig => config
