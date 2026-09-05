import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};

export const contentType = 'image/png';

export default async function Icon() {
  const logoFile = await fetch(
    new URL('../public/brand/logos/Kirmary-Logo-02-copy.png', import.meta.url)
  );

  const logoBuffer = await logoFile.arrayBuffer();

  const bytes = new Uint8Array(logoBuffer);
  let binary = '';

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  const logoSrc = `data:image/png;base64,${btoa(binary)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '64px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={logoSrc}
          style={{
            position: 'absolute',
            width: '570px',
            height: '102px',
            maxWidth: 'none',
            left: '0px',
            top: '-18px',
          }}
        />
      </div>
    ),
    {
      width: 64,
      height: 64,
    }
  );
}