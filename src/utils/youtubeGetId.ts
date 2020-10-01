export default function youtubeGetId(url: string): string {
  let id = '';
  const parsedUrl = url
    .replace(/(>|<)/gi, '')
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (parsedUrl[2] !== undefined) {
    const aux = parsedUrl[2].split(/[^0-9a-z_\-]/i);
    [id] = aux;
  } else {
    id = url;
  }
  return id;
}
