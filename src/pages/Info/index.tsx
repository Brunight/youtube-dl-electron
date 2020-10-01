import { remote } from 'electron';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  FiMusic,
  FiMic,
  FiDisc,
  FiMessageSquare,
  FiArrowLeft,
} from 'react-icons/fi';
import { BsArrowUpDown } from 'react-icons/bs';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import isDev from 'electron-is-dev';
import CropperJS from 'cropperjs';

import fs from 'fs';
import { resolve } from 'path';

import { Container, Content, StyledLink } from './styles';
import Cropper from '../../components/Cropper';
import TimeSlider, { ChangeEventData } from './TimeSlider';

import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

import YoutubeVideo from '../../classes/YoutubeVideo';
import AudioFile from '../../classes/AudioFile';

interface InfoParams {
  source: 'youtube' | 'file';
  id: 'string';
}

const Info: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { params } = useRouteMatch<InfoParams>();
  const [cropper, setCropper] = useState<CropperJS>();
  const [durationMs, setDurationMs] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [durationTime, setDurationTime] = useState('');
  const [cover, setCover] = useState('');
  const [loading, setLoading] = useState(true);

  const { addToast } = useToast();

  const ytVideo = useMemo(() => new YoutubeVideo(), []);
  const audioFile = useMemo(() => new AudioFile(), []);

  useEffect(() => {
    async function run() {
      if (params.source === 'youtube') {
        const url = `https://www.youtube.com/watch?v=${params.id}`;

        await ytVideo.init(url);

        // Having Cors problem
        setCover(
          isDev
            ? `http://cors-anywhere.herokuapp.com/${ytVideo.thumbnailUrl}`
            : ytVideo.thumbnailUrl,
        );

        setLoading(false);

        formRef.current?.setData(ytVideo.getParsedDataFromTitle());

        setDurationMs(ytVideo.durationMs);
        document.title = `Editing ${ytVideo.title}`;
      }
      if (params.source === 'file') {
        await audioFile.init(params.id);

        setCover(audioFile.coverData);
        setDurationMs(audioFile.durationMs);

        setLoading(false);

        formRef.current?.setData(audioFile.getData());
        document.title = `Editing ${audioFile.title}`;
      }
    }
    run();
  }, [params.id, params.source, ytVideo, audioFile]);

  const handleTimeSliderChange = useCallback(
    ({ start, end, duration }: ChangeEventData) => {
      setStartTime(start);
      setEndTime(end);
      setDurationTime(duration);
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (typeof cropper !== 'undefined') {
      window.scrollTo(0, 0);
      cropper.getCroppedCanvas().toBlob(async (blob: Blob) => {
        try {
          const buffer = Buffer.from(await blob.arrayBuffer());

          const tmpPath = resolve(
            remote.app.getPath('temp'),
            'youtube-dl-electron',
          );
          if (!fs.existsSync(tmpPath)) {
            fs.mkdirSync(tmpPath);
          }
          const tmpCoverPath = resolve(tmpPath, 'tmpcover.jpg');

          const finalTitle = formRef.current?.getFieldValue('title');
          const finalArtist = formRef.current?.getFieldValue('artist');

          const suggestedFilename = `${finalArtist}${
            finalArtist && ' - '
          }${finalTitle}.mp3`.replace(/[/\\?%*:|"<>]/g, ' ');

          const savePath =
            params.source === 'file'
              ? 'a'
              : remote.dialog.showSaveDialogSync({
                  defaultPath: resolve(
                    remote.app.getPath('music'),
                    suggestedFilename,
                  ),
                  filters: [
                    {
                      name: 'Audio file',
                      extensions: ['mp3'],
                    },
                  ],
                });

          console.log(savePath);

          if (!savePath) return;
          fs.writeFileSync(tmpCoverPath, buffer);

          addToast({
            title: 'Starting process...',
          });

          if (params.source === 'youtube')
            await ytVideo.downloadAudio({
              path: savePath,
              title: finalTitle,
              artist: finalArtist,
              album: formRef.current?.getFieldValue('album'),
              comment: formRef.current?.getFieldValue('comment'),
              startTime,
              endTime,
              duration: durationTime,
              coverPath: tmpCoverPath,
            });
          else {
            await audioFile.saveFile({
              title: finalTitle,
              artist: finalArtist,
              album: formRef.current?.getFieldValue('album'),
              comment: formRef.current?.getFieldValue('comment'),
              startTime,
              endTime,
              duration: durationTime,
              coverPath: tmpCoverPath,
            });
          }

          fs.unlinkSync(tmpCoverPath);

          addToast({
            title: 'Done!',
            type: 'success',
          });
          history.push('/');
        } catch (err) {
          addToast({
            title: 'Error!',
            description: err.toString(),
            type: 'error',
          });
          console.log(err);
        }
      });
    }
  }, [
    cropper,
    addToast,
    startTime,
    endTime,
    durationTime,
    history,
    ytVideo,
    audioFile,
    params.source,
  ]);

  const handleSwipe = useCallback(() => {
    const oldTitle = formRef.current?.getFieldValue('title');
    const oldArtist = formRef.current?.getFieldValue('artist');
    let oldAlbum = formRef.current?.getFieldValue('album');
    if (oldAlbum.includes(' - ')) {
      const albumArray = oldAlbum.split(' - ');
      oldAlbum = `${albumArray[1]} - ${albumArray[0]}`;
    }
    formRef.current?.setData({
      title: oldArtist,
      artist: oldTitle,
      album: oldAlbum,
    });
  }, []);

  return (
    <>
      {loading ? (
        <>
          <h1>Carregando...</h1>
          <StyledLink to="/">
            <FiArrowLeft />
            Back
          </StyledLink>
        </>
      ) : (
        <Container>
          <Content>
            <Cropper
              imgUrl={cover}
              onInitialized={instance => {
                setCropper(instance);
              }}
              style={{ width: '100%' }}
            />
            <TimeSlider
              onChange={e => handleTimeSliderChange(e)}
              timeMs={durationMs}
            />
            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input
                name="title"
                type="text"
                placeholder="Title"
                icon={FiMusic}
              />
              <BsArrowUpDown
                size={32}
                style={{ marginTop: '16px', marginBottom: '16px' }}
                onClick={handleSwipe}
                cursor="pointer"
              />
              <Input
                name="artist"
                type="text"
                placeholder="Artist"
                icon={FiMic}
              />
              <Input
                name="album"
                type="text"
                placeholder="Album"
                icon={FiDisc}
              />
              <Input
                name="comment"
                type="text"
                placeholder="Comment"
                icon={FiMessageSquare}
              />
              <Button type="submit">
                {params.source === 'youtube' ? 'Download' : 'Save'}
              </Button>
            </Form>
            <StyledLink to="/">
              <FiArrowLeft />
              Back
            </StyledLink>
          </Content>
        </Container>
      )}
    </>
  );
};

export default Info;
