import fetch from 'node-fetch'

export default async function random_squirrel_buffer() {
  const response = await fetch('https://source.unsplash.com/random/?squirrel');
  const buffer = Buffer.from(await response.arrayBuffer());

  return {
    buffer,
    url: response.url
  };
};