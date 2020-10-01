const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');

const logoPath = path.resolve(__dirname, 'assets', 'logo');
const logoPngPath = path.resolve(__dirname, 'assets', 'logo.png');
const logoIconPath = path.resolve(__dirname, 'assets', 'logo.ico');
const logoIcnsPath = path.resolve(__dirname, 'assets', 'logo.icns');

module.exports = {
  packagerConfig: {
    win32metadata:{
      ProductName: 'Youtube DL Electron',
      CompanyName: 'Brunight'
    },
    icon: logoPath,
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
        setupIcon: logoIconPath,
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
      config: {
        icon: logoPngPath,
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: logoIcnsPath,
        format: 'ULFO'
      }
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
