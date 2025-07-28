import type { Configuration } from 'webpack';
import Dotenv from 'dotenv-webpack';

const config: Configuration = {
  plugins: [
    new Dotenv({
      systemvars: true,
      silent: true,
      defaults: false,
      ignoreStub: true,
      safe: false,
      allowEmptyValues: true
    })
  ]
};

export default config;
