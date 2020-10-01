const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');

module.exports = {
  packagerConfig: {
    icon: path.resolve(__dirname, 'assets', 'logo'),
    afterExtract: [
      (extractPath, electronVersion, platform, arch, done) => {
        fs.copyFileSync(
          ffmpegPath,
          path.resolve(extractPath, 'resources', path.basename(ffmpegPath))
        )
        done()
      }
    ]
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'youtube_dl_electron',
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [
        'darwin'
      ]
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.tsx',
              name: 'main_window'
            }
          ]
        }
      }
    ]
  ]
}
