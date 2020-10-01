![](assets/prints/preview.gif)
(Outdated gif preview)

# 🎈 About
This is an Electron interface for converting Youtube videos to mp3 files with metadata (tags) and album cover art using **ytdl-core** (a pure JavaScript alternative for youtube-dl) and **ffmpeg**. Built with [Electron Forge](https://www.electronforge.io).

Allows cropping the video's thumbnail, image file or image url and set it as the album cover art, as well as set a specific duration to audio.

You can also edit audio files. Supported formats:
- mp3;
- flac;
- m4a (converted to mp3 as they are almost the same, and ffmpeg can't handle covers in m4a).

Untested formats:
- wav;
- ogg.

# 📝 Requirements
- NodeJS and NPM or Yarn;
- Windows (Linux and MacOS untested);

# 🛠 Installation
After entering the cloned directory:

With npm use:
```bash
npm install
```
Or with yarn use:
```bash
yarn install
```

# 🚀 Usage
To start development with npm do:
```bash
npm run start
```
Or with yarn do:
```bash
yarn start
```

And that's it. Simply paste an Youtube video link, set the data you want for audio file and press **Download**.

When done, you'll be moved back to the homepage and there'll be a Toast showing the status. If succeeded, a new explorer window will open with the resulting file selected.

You can also drag'n drop or manually select an audio file and edit it's tags, covert art and duration. See supported formats above.

If you just want to crop an image, there's also a tool for doing that. Just click in the **Cropper** button. You can drag the resulting image, or save it.

Remember, you should avoid setting the same album name for multiple files with different cover art to avoid conflicts.


To make package for your current operational system, with npm do:
```bash
npm run make
```
Or with yarn do:
```bash
yarn make
```
In Windows, this will generate .exe file and an installer.

# 📜 Planned features
- Release this app;
- Set volume;
- Show process progress;
- Download video;
- Download history (with database);
- Solve some Cors Policy problems;
- Suggest album name and cover art by song title and artist;
- Playlist support;

-  ~~Drag and drop image to load in Cropper canvas;~~
- ~~Upload files and change their metadata without changing format, codec, sample rate and bitrate;~~

- ~~Mix [api](https://github.com/brunight/youtube-dl-api) and [web](https://github.com/brunight/youtube-dl-web) interface into an independent ElectronJS application;~~

# 👨‍💻 Technologies
- TypeScript;
- React;
- Context API;
- Styled Components;
- Polished;
- Moment;
- [Unform](https://github.com/Rocketseat/unform);
- [CropperJS](https://github.com/fengyuanchen/cropperjs) and [React Cropper](https://github.com/react-cropper/react-cropper);
- [React Slider](https://github.com/zillow/react-slider);
- React Icons;
- React Spring;
- uuidv4;

- [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg);
- [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static);
- [ytdl-core](https://github.com/fent/node-ytdl-core);
- [metaflac-js](https://github.com/ishowshao/metaflac-js);
- [music-metadata](https://github.com/borewit/music-metadata);
- ESLint;
- Prettier;
- Color scheme based on [Omni Theme](https://github.com/getomni);

# 📃 License
MIT. Not recommended to use with copyrighted content. Developed by [Bruno Rodrigues](https://github.com/brunight/).
